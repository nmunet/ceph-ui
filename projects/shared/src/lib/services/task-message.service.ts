import { Injectable } from '@angular/core';
import _ from 'lodash';

import { Components } from '../enum/components.enum';
import { FinishedTask } from '../models/finished-task';
import { ImageSpec } from '../models/image-spec';
import { Task } from '../models/task';
import { PluralizePipe } from '../pipes/pluralize.pipe';

export class TaskMessageOperation {
  running: string;
  failure: string;
  success: string;

  constructor(running: string, failure: string, success: string) {
    this.running = running;
    this.failure = failure;
    this.success = success;
  }
}

class TaskMessage {
  operation: TaskMessageOperation;
  involves: (object: any) => string;
  errors: (metadata: any) => object;

  failure(metadata: any): string {
    return `Failed to ${this.operation.failure} ${this.involves(metadata)}`;
  }

  running(metadata: any): string {
    return `${this.operation.running} ${this.involves(metadata)}`;
  }

  success(metadata: any): string {
    return `${this.operation.success} ${this.involves(metadata)}`;
  }

  constructor(
    operation: TaskMessageOperation,
    involves: (metadata: any) => string,
    errors?: (metadata: any) => object
  ) {
    this.operation = operation;
    this.involves = involves;
    this.errors = errors || (() => ({}));
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskMessageService {
  defaultMessage = this.newTaskMessage(
    new TaskMessageOperation(`Executing`, `execute`, `Executed`),
    (metadata) => {
      return (
        (metadata && (Components[metadata.component] || metadata.component)) ||
        `unknown task`
      );
    },
    () => {
      return {};
    }
  );

  pluralize = new PluralizePipe().transform;

  commonOperations = {
    create: new TaskMessageOperation(`Creating`, `create`, `Created`),
    update: new TaskMessageOperation(`Updating`, `update`, `Updated`),
    delete: new TaskMessageOperation(`Deleting`, `delete`, `Deleted`),
    add: new TaskMessageOperation(`Adding`, `add`, `Added`),
    remove: new TaskMessageOperation(`Removing`, `remove`, `Removed`),
    import: new TaskMessageOperation(`Importing`, `import`, `Imported`),
    activate: new TaskMessageOperation(
      `Importing`,
      `activate`,
      `Activated`
    ),
    deactivate: new TaskMessageOperation(
      `Importing`,
      `deactivate`,
      `Deactivated`
    )
  };

  rbd = {
    default: (metadata: any) => `RBD '${metadata.image_spec}'`,
    create: (metadata: any) => {
      const id = new ImageSpec(
        metadata.pool_name,
        metadata.namespace,
        metadata.image_name
      ).toString();
      return `RBD '${id}'`;
    },
    child: (metadata: any) => {
      const id = new ImageSpec(
        metadata.child_pool_name,
        metadata.child_namespace,
        metadata.child_image_name
      ).toString();
      return `RBD '${id}'`;
    },
    destination: (metadata: any) => {
      const id = new ImageSpec(
        metadata.dest_pool_name,
        metadata.dest_namespace,
        metadata.dest_image_name
      ).toString();
      return `RBD '${id}'`;
    },
    snapshot: (metadata: any) =>
      `RBD snapshot '${metadata.image_spec}@${metadata.snapshot_name}'`
  };

  rbd_mirroring = {
    site_name: () => `mirroring site name`,
    bootstrap: () => `bootstrap token`,
    pool: (metadata: any) => `mirror mode for pool '${metadata.pool_name}'`,
    pool_peer: (metadata: any) => `mirror peer for pool '${metadata.pool_name}'`
  };

  grafana = {
    update_dashboards: () => `all dashboards`
  };

  messages = {
    // Host tasks
    'host/add': this.newTaskMessage(this.commonOperations.add, (metadata) => this.host(metadata)),
    'host/remove': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.host(metadata)
    ),
    'host/identify_device': this.newTaskMessage(
      new TaskMessageOperation(`Identifying`, `identify`, `Identified`),
      (metadata) => `device '${metadata.device}' on host '${metadata.hostname}'`
    ),
    // OSD tasks
    'osd/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata) => `OSDs (DriveGroups: ${metadata.tracking_id})`
    ),
    'osd/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.osd(metadata)
    ),
    // Pool tasks
    'pool/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata) => this.pool(metadata),
      (metadata) => ({
        '17': `Name is already used by ${this.pool(metadata)}.`
      })
    ),
    'pool/edit': this.newTaskMessage(
      this.commonOperations.update,
      (metadata) => this.pool(metadata),
      (metadata) => ({
        '17': `Name is already used by ${this.pool(metadata)}.`
      })
    ),
    'pool/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.pool(metadata)
    ),
    // Erasure code profile tasks
    'ecp/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata) => this.ecp(metadata),
      (metadata) => ({
        '17': `Name is already used by ${this.ecp(metadata)}.`
      })
    ),
    'ecp/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.ecp(metadata)
    ),
    // Crush rule tasks
    'crushRule/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata) => this.crushRule(metadata),
      (metadata) => ({
        '17': `Name is already used by ${this.crushRule(metadata)}.`
      })
    ),
    'crushRule/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.crushRule(metadata)
    ),
    // RBD tasks
    'rbd/create': this.newTaskMessage(
      this.commonOperations.create,
      this.rbd.create,
      (metadata) => ({
        '17': `Name is already used by ${this.rbd.create(metadata)}.`
      })
    ),
    'rbd/edit': this.newTaskMessage(this.commonOperations.update, this.rbd.default, (metadata) => ({
      '17': `Name is already used by ${this.rbd.default(metadata)}.`
    })),
    'rbd/delete': this.newTaskMessage(
      this.commonOperations.delete,
      this.rbd.default,
      (metadata) => ({
        '16': `${this.rbd.default(metadata)} is busy.`,
        '39': `${this.rbd.default(metadata)} contains snapshots.`
      })
    ),
    'rbd/clone': this.newTaskMessage(
      new TaskMessageOperation(`Cloning`, `clone`, `Cloned`),
      this.rbd.child,
      (metadata) => ({
        '17': `Name is already used by ${this.rbd.child(metadata)}.`,
        '22': `Snapshot of ${this.rbd.child(metadata)} must be protected.`
      })
    ),
    'rbd/copy': this.newTaskMessage(
      new TaskMessageOperation(`Copying`, `copy`, `Copied`),
      this.rbd.destination,
      (metadata) => ({
        '17': `Name is already used by ${this.rbd.destination(metadata)}.`
      })
    ),
    'rbd/flatten': this.newTaskMessage(
      new TaskMessageOperation(`Flattening`, `flatten`, `Flattened`),
      this.rbd.default
    ),
    // RBD snapshot tasks
    'rbd/snap/create': this.newTaskMessage(
      this.commonOperations.create,
      this.rbd.snapshot,
      (metadata) => ({
        '17': `Name is already used by ${this.rbd.snapshot(metadata)}.`
      })
    ),
    'rbd/snap/edit': this.newTaskMessage(
      this.commonOperations.update,
      this.rbd.snapshot,
      (metadata) => ({
        '16': `Cannot unprotect ${this.rbd.snapshot(
          metadata
        )} because it contains child images.`
      })
    ),
    'rbd/snap/delete': this.newTaskMessage(
      this.commonOperations.delete,
      this.rbd.snapshot,
      (metadata) => ({
        '16': `Cannot delete ${this.rbd.snapshot(metadata)} because it's protected.`
      })
    ),
    'rbd/snap/rollback': this.newTaskMessage(
      new TaskMessageOperation(
        `Rolling back`,
        `rollback`,
        `Rolled back`
      ),
      this.rbd.snapshot
    ),
    // RBD trash tasks
    'rbd/trash/move': this.newTaskMessage(
      new TaskMessageOperation(`Moving`, `move`, `Moved`),
      (metadata) => `image '${metadata.image_spec}' to trash`,
      () => ({
        2: `Could not find image.`
      })
    ),
    'rbd/trash/restore': this.newTaskMessage(
      new TaskMessageOperation(`Restoring`, `restore`, `Restored`),
      (metadata) => `image '${metadata.image_id_spec}' into '${metadata.new_image_name}'`,
      (metadata) => ({
        17: `Image name '${metadata.new_image_name}' is already in use.`
      })
    ),
    'rbd/trash/remove': this.newTaskMessage(
      new TaskMessageOperation(`Deleting`, `delete`, `Deleted`),
      (metadata) => `image '${metadata.image_id_spec}'`
    ),
    'rbd/trash/purge': this.newTaskMessage(
      new TaskMessageOperation(`Purging`, `purge`, `Purged`),
      (metadata) => {
        let message = `all pools`;
        if (metadata.pool_name) {
          message = `'${metadata.pool_name}'`;
        }
        return `images from ${message}`;
      }
    ),
    // RBD mirroring tasks
    'rbd/mirroring/site_name/edit': this.newTaskMessage(
      this.commonOperations.update,
      this.rbd_mirroring.site_name,
      () => ({})
    ),
    'rbd/mirroring/bootstrap/create': this.newTaskMessage(
      this.commonOperations.create,
      this.rbd_mirroring.bootstrap,
      () => ({})
    ),
    'rbd/mirroring/bootstrap/import': this.newTaskMessage(
      this.commonOperations.import,
      this.rbd_mirroring.bootstrap,
      () => ({})
    ),
    'rbd/mirroring/pool/edit': this.newTaskMessage(
      this.commonOperations.update,
      this.rbd_mirroring.pool,
      () => ({
        16: `Cannot disable mirroring because it contains a peer.`
      })
    ),
    'rbd/mirroring/peer/add': this.newTaskMessage(
      this.commonOperations.create,
      this.rbd_mirroring.pool_peer,
      () => ({})
    ),
    'rbd/mirroring/peer/edit': this.newTaskMessage(
      this.commonOperations.update,
      this.rbd_mirroring.pool_peer,
      () => ({})
    ),
    'rbd/mirroring/peer/delete': this.newTaskMessage(
      this.commonOperations.delete,
      this.rbd_mirroring.pool_peer,
      () => ({})
    ),
    // RGW operations
    'rgw/bucket/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) => {
      return `${metadata.bucket_names[0]}`;
    }),
    'rgw/bucket/notification/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => {
        return `${metadata.notification_id[0]}`;
      }
    ),
    'rgw/accounts': this.newTaskMessage(this.commonOperations.delete, (metadata) => {
      return `${`account '${metadata.account_names[0]}'`}`;
    }),
    'rgw/multisite/sync-policy/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => {
        return `${
          metadata.group_names.length > 1
            ? 'selected policy groups'
            : `policy group '${metadata.group_names[0]}'`
        }`;
      }
    ),
    'rgw/multisite/sync-flow/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => {
        return `${
          metadata.flow_ids.length > 1 ? 'selected Flow' : `Flow '${metadata.flow_ids[0]}'`
        }`;
      }
    ),
    'rgw/multisite/sync-pipe/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => {
        return `${
          metadata.pipe_ids.length > 1 ? 'selected pipe' : `Pipe '${metadata.pipe_ids[0]}'`
        }`;
      }
    ),
    // storage-class
    'rgw/zonegroup/storage-class': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.rgwStorageClass(metadata)
    ),
    // iSCSI target tasks
    'iscsi/target/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.iscsiTarget(metadata)
    ),
    'iscsi/target/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.iscsiTarget(metadata)
    ),
    'iscsi/target/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.iscsiTarget(metadata)
    ),
    // nvmeof
    'nvmeof/subsystem/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.nvmeofSubsystem(metadata)
    ),
    'nvmeof/subsystem/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.nvmeofSubsystem(metadata)
    ),
    'nvmeof/listener/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.nvmeofListener(metadata)
    ),
    'nvmeof/listener/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.nvmeofListener(metadata)
    ),
    'nvmeof/namespace/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.nvmeofNamespace(metadata)
    ),
    'nvmeof/namespace/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.nvmeofNamespace(metadata)
    ),
    'nvmeof/namespace/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.nvmeofNamespace(metadata)
    ),
    'nvmeof/initiator/add': this.newTaskMessage(this.commonOperations.add, (metadata) =>
      this.nvmeofInitiator(metadata)
    ),
    'nvmeof/initiator/remove': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.nvmeofInitiator(metadata)
    ),
    // nfs
    'nfs/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.nfs(metadata)
    ),
    'nfs/edit': this.newTaskMessage(this.commonOperations.update, (metadata) => this.nfs(metadata)),
    'nfs/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.nfs(metadata)
    ),
    'rgw/destination/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.destination(metadata)
    ),
    // Grafana tasks
    'grafana/dashboards/update': this.newTaskMessage(
      this.commonOperations.update,
      this.grafana.update_dashboards,
      () => ({})
    ),
    // Service tasks
    'service/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.service(metadata)
    ),
    'service/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.service(metadata)
    ),
    'service/delete': this.newTaskMessage(this.commonOperations.delete, (metadata) =>
      this.service(metadata)
    ),
    'crud-component/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.crudMessage(metadata)
    ),
    'crud-component/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.crudMessage(metadata)
    ),
    'crud-component/import': this.newTaskMessage(this.commonOperations.import, (metadata) =>
      this.crudMessage(metadata)
    ),
    'crud-component/id': this.newTaskMessage(this.commonOperations.delete, (id) =>
      this.crudMessageId(id)
    ),
    'cephfs/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.volume(metadata)
    ),
    'cephfs/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.volume(metadata)
    ),
    'cephfs/auth': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.auth(metadata)
    ),
    'cephfs/remove': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.volume(metadata)
    ),
    'cephfs/subvolume/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.subvolume(metadata)
    ),
    'cephfs/subvolume/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.subvolume(metadata)
    ),
    'cephfs/subvolume/remove': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.subvolume(metadata)
    ),
    'cephfs/subvolume/group/create': this.newTaskMessage(this.commonOperations.create, (metadata) =>
      this.subvolumegroup(metadata)
    ),
    'cephfs/subvolume/group/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.subvolumegroup(metadata)
    ),
    'cephfs/subvolume/group/remove': this.newTaskMessage(this.commonOperations.remove, (metadata) =>
      this.subvolumegroup(metadata)
    ),
    'cephfs/subvolume/snapshot/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata) => this.snapshot(metadata)
    ),
    'cephfs/subvolume/snapshot/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => this.snapshot(metadata)
    ),
    'cephfs/snapshot/schedule/create': this.newTaskMessage(this.commonOperations.add, (metadata) =>
      this.snapshotSchedule(metadata)
    ),
    'cephfs/snapshot/schedule/edit': this.newTaskMessage(this.commonOperations.update, (metadata) =>
      this.snapshotSchedule(metadata)
    ),
    'cephfs/snapshot/schedule/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata) => this.snapshotSchedule(metadata)
    ),
    'cephfs/snapshot/schedule/activate': this.newTaskMessage(
      this.commonOperations.activate,
      (metadata) => this.snapshotSchedule(metadata)
    ),
    'cephfs/snapshot/schedule/deactivate': this.newTaskMessage(
      this.commonOperations.deactivate,
      (metadata) => this.snapshotSchedule(metadata)
    ),
    // smb
    'cephfs/smb/cluster/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata: { cluster_id: string }) => this.smbCluster(metadata)
    ),
    'cephfs/smb/cluster/edit': this.newTaskMessage(
      this.commonOperations.update,
      (metadata: { cluster_id: string }) => this.smbCluster(metadata)
    ),
    'cephfs/smb/cluster/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata: { cluster_id: string }) => this.smbCluster(metadata)
    ),
    'cephfs/smb/share/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata: Record<'share_id', string>) => this.smbShare(metadata)
    ),
    'cephfs/smb/share/edit': this.newTaskMessage(
      this.commonOperations.update,
      (metadata: Record<'share_id', string>) => this.smbShare(metadata)
    ),
    'cephfs/smb/share/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata: Record<'share_id', string>) => this.smbShare(metadata)
    ),
    'cephfs/smb/active-directory/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata: { authId: string }) => this.smbJoinAuth(metadata)
    ),
    'cephfs/smb/active-directory/edit': this.newTaskMessage(
      this.commonOperations.update,
      (metadata: { authId: string }) => this.smbJoinAuth(metadata)
    ),
    'cephfs/smb/active-directory/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata: { authId: string }) => this.smbJoinAuth(metadata)
    ),
    'cephfs/smb/standalone/create': this.newTaskMessage(
      this.commonOperations.create,
      (metadata: { usersGroupsId: string }) => this.smbUsersgroups(metadata)
    ),
    'cephfs/smb/standalone/edit': this.newTaskMessage(
      this.commonOperations.update,
      (metadata: { usersGroupsId: string }) => this.smbUsersgroups(metadata)
    ),
    'cephfs/smb/standalone/delete': this.newTaskMessage(
      this.commonOperations.delete,
      (metadata: { usersGroupsId: string }) => this.smbUsersgroups(metadata)
    )
  };

  newTaskMessage(
    operation: TaskMessageOperation,
    involves: (metadata: any) => string,
    errors?: (metadata: any) => object
  ) {
    return new TaskMessage(operation, involves, errors);
  }

  host(metadata: any) {
    return `host '${metadata.hostname}'`;
  }

  osd(metadata: any) {
    return `OSD '${metadata.svc_id}'`;
  }

  pool(metadata: any) {
    return `pool '${metadata.pool_name}'`;
  }

  ecp(metadata: any) {
    return `erasure code profile '${metadata.name}'`;
  }

  crushRule(metadata: any) {
    return `crush rule '${metadata.name}'`;
  }

  iscsiTarget(metadata: any) {
    return `target '${metadata.target_iqn}'`;
  }

  nvmeofSubsystem(metadata: any) {
    return `subsystem '${metadata.nqn}'`;
  }

  nvmeofListener(metadata: any) {
    return `listener '${metadata.host_name} for subsystem ${metadata.nqn}`;
  }

  nvmeofNamespace(metadata: { nqn: string; nsCount?: number; nsid?: string }) {
    if (metadata?.nsid) {
      return `namespace ${metadata.nsid} for subsystem '${metadata.nqn}'`;
    }
    return `${metadata.nsCount} ${this.pluralize(
      'namespace',
      metadata.nsCount
    )} for subsystem '${metadata.nqn}'`;
  }

  nvmeofInitiator(metadata: { plural: number; nqn: string }) {
    return `${this.pluralize('initiator', metadata.plural)} for subsystem ${metadata.nqn}`;
  }

  nfs(metadata: any) {
    return `NFS '${metadata.cluster_id}\:${
      metadata.export_id ? metadata.export_id : metadata.path
    }'`;
  }

  smbCluster(metadata: { cluster_id: string }) {
    return `SMB cluster  '${metadata.cluster_id}'`;
  }

  smbShare(metadata: Record<'share_id', string>) {
    return `SMB share '${metadata?.share_id}'`;
  }

  smbJoinAuth(metadata: { authId: string }) {
    return `SMB active directory access resource '${metadata.authId}'`;
  }

  smbUsersgroups(metadata: { usersGroupsId: string }) {
    return `SMB users and groups access resource '${metadata.usersGroupsId}'`;
  }

  destination(metadata: any) {
    return `Notification destination  '${metadata.name}'`;
  }
  notification(metadata: any) {
    return `Notification  '${metadata.name}'`;
  }
  service(metadata: any) {
    return `service '${metadata.service_name}'`;
  }

  rgwStorageClass(metadata: any) {
    return `Storage Class  '${metadata.storage_class}'`;
  }

  crudMessage(metadata: any) {
    let message = metadata.__message;
    _.forEach(metadata, (value, key) => {
      if (key != '__message') {
        let regex = '{' + key + '}';
        message = message.replace(regex, value);
      }
    });
    return `${message}`;
  }

  volume(metadata: any) {
    return `'${metadata.volumeName}'`;
  }

  auth(metadata: any) {
    return `client.${metadata.clientId} authorization successfully`;
  }

  subvolume(metadata: any) {
    return `subvolume '${metadata.subVolumeName}'`;
  }

  subvolumegroup(metadata: any) {
    return `subvolume group '${metadata.subvolumegroupName}'`;
  }

  snapshot(metadata: any) {
    return `snapshot '${metadata.snapshotName}'`;
  }

  snapshotSchedule(metadata: any) {
    return `snapshot schedule for path '${metadata?.path}'`;
  }

  crudMessageId(id: string) {
    return `${id}`;
  }

  _getTaskTitle(task: Task) {
    if (task.name && task.name.startsWith('progress/')) {
      // we don't fill the failure string because, at least for now, all
      // progress module tasks will be considered successful
      return this.newTaskMessage(
        new TaskMessageOperation(
          task.name.replace('progress/', ''),
          '',
          task.name.replace('progress/', '')
        ),
        (_metadata) => ''
      );
    }
    return this.messages[task.name] || this.defaultMessage;
  }

  getSuccessTitle(task: FinishedTask) {
    return this._getTaskTitle(task).success(task.metadata);
  }

  getErrorMessage(task: FinishedTask) {
    return (
      this._getTaskTitle(task).errors(task.metadata)[task.exception.code] || task.exception.detail
    );
  }

  getErrorTitle(task: Task) {
    return this._getTaskTitle(task).failure(task.metadata);
  }

  getRunningTitle(task: Task) {
    return this._getTaskTitle(task).running(task.metadata);
  }

  getRunningText(task: Task) {
    return this._getTaskTitle(task).operation.running;
  }
}
