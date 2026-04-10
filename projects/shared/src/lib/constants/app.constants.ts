import { Injectable } from '@angular/core';

export class AppConstants {
  public static readonly organization = 'ceph';
  public static readonly projectName = 'Ceph Dashboard';
  public static readonly defaultUser = 'dashboard';
  public static readonly license = 'Free software (LGPL 2.1).';
  public static readonly cephLogo = 'assets/Ceph_Logo.svg';
}

export enum URLVerbs {
  /* Create a new item */
  CREATE = 'create',

  /* Make changes to an existing item */
  EDIT = 'edit',

  /* Make changes to an existing item */
  UPDATE = 'update',

  /* Remove an item from a container WITHOUT deleting it */
  REMOVE = 'remove',

  /* Destroy an existing item */
  DELETE = 'delete',

  /* Add an existing item to a container */
  ADD = 'add',

  /* Non-standard verbs */
  COPY = 'copy',
  CLONE = 'clone',
  VIEW = 'view',

  /* Prometheus wording */
  RECREATE = 'recreate',
  EXPIRE = 'expire',

  /* Daemons */
  RESTART = 'Restart',

  /* Multi-cluster */
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  GATEWAY_GROUP = 'Gateway group'
}

export enum ActionLabels {
  /* Create a new item */
  CREATE = 'Create',

  /* Destroy an existing item */
  DELETE = 'Delete',

  /* Add an existing item to a container */
  ADD = 'Add',

  /* Remove an item from a container WITHOUT deleting it */
  REMOVE = 'Remove',

  /* Make changes to an existing item */
  EDIT = 'Edit',

  /* */
  CANCEL = 'Cancel',

  /* Non-standard actions */
  COPY = 'Copy',
  CLONE = 'Clone',
  UPDATE = 'Update',
  EVICT = 'Evict',

  /* Read-only */
  SHOW = 'Show',

  /* Prometheus wording */
  RECREATE = 'Recreate',
  EXPIRE = 'Expire',

  /* Daemons */
  START = 'Start',
  STOP = 'Stop',
  REDEPLOY = 'Redeploy',
  RESTART = 'Restart',

  /* Multi-cluster */
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  VIEW = 'View'
}

@Injectable({
  providedIn: 'root'
})
export class ActionLabelsI18n {
  /* This service is required as the i18n polyfill does not provide static
  translation
  */
  CREATE: string;
  DELETE: string;
  ADD: string;
  REMOVE: string;
  EDIT: string;
  CANCEL: string;
  PREVIEW: string;
  MOVE: string;
  NEXT: string;
  BACK: string;
  CHANGE: string;
  COPY: string;
  CLONE: string;
  DEEP_SCRUB: string;
  DESTROY: string;
  EVICT: string;
  EXPIRE: string;
  FLATTEN: string;
  MARK_DOWN: string;
  MARK_IN: string;
  MARK_LOST: string;
  MARK_OUT: string;
  PROTECT: string;
  PURGE: string;
  RECREATE: string;
  RENAME: string;
  RESTORE: string;
  REWEIGHT: string;
  ROLLBACK: string;
  SCRUB: string;
  SET: string;
  SUBMIT: string;
  SHOW: string;
  TIERING: string;
  TRASH: string;
  UNPROTECT: string;
  UNSET: string;
  UPDATE: string;
  FLAGS: string;
  ENTER_MAINTENANCE: string;
  EXIT_MAINTENANCE: string;
  REMOVE_SCHEDULING: string;
  PROMOTE: string;
  DEMOTE: string;
  START_DRAIN: string;
  STOP_DRAIN: string;
  START: string;
  STOP: string;
  REDEPLOY: string;
  RESTART: string;
  RESYNC: string;
  EXPORT: string;
  IMPORT: any;
  MIGRATE: string;
  START_UPGRADE: string;
  ACTIVATE: string;
  DEACTIVATE: string;
  ATTACH: string;
  CONNECT: string;
  DISCONNECT: string;
  RECONNECT: string;
  AUTHORIZE: string;
  ADD_STORAGE: string;
  SETUP_MULTISITE_REPLICATION: string;
  NFS_EXPORT: string;
  VIEW: string;
  constructor() {
    /* Create a new item */
    this.CREATE = `Create`;

    this.EXPORT = `Export`;

    this.IMPORT = `Import`;

    this.SETUP_MULTISITE_REPLICATION = `Setup Multi-site Replication`;

    this.MIGRATE = `Migrate`;

    /* Destroy an existing item */
    this.DELETE = `Delete`;

    /* Add an existing item to a container */
    this.ADD = `Add`;
    this.SET = `Set`;
    this.SUBMIT = `Submit`;

    /* Remove an item from a container WITHOUT deleting it */
    this.REMOVE = `Remove`;
    this.UNSET = `Unset`;

    /* Make changes to an existing item */
    this.EDIT = `Edit`;
    this.UPDATE = `Update`;
    this.CANCEL = `Cancel`;
    this.PREVIEW = `Preview`;
    this.MOVE = `Move`;

    /* Wizard wording */
    this.NEXT = `Next`;
    this.BACK = `Back`;

    /* Non-standard actions */
    this.CLONE = `Clone`;
    this.COPY = `Copy`;
    this.DEEP_SCRUB = `Deep Scrub`;
    this.DESTROY = `Destroy`;
    this.EVICT = `Evict`;
    this.FLATTEN = `Flatten`;
    this.MARK_DOWN = `Mark Down`;
    this.MARK_IN = `Mark In`;
    this.MARK_LOST = `Mark Lost`;
    this.MARK_OUT = `Mark Out`;
    this.PROTECT = `Protect`;
    this.PURGE = `Purge`;
    this.RENAME = `Rename`;
    this.RESTORE = `Restore`;
    this.REWEIGHT = `Reweight`;
    this.ROLLBACK = `Rollback`;
    this.SCRUB = `Scrub`;
    this.SHOW = `Show`;
    this.TIERING = `Tiering`;
    this.TRASH = `Move to Trash`;
    this.UNPROTECT = `Unprotect`;
    this.CHANGE = `Change`;
    this.FLAGS = `Flags`;
    this.ENTER_MAINTENANCE = `Enter Maintenance`;
    this.EXIT_MAINTENANCE = `Exit Maintenance`;
    this.AUTHORIZE = `Authorize`;

    this.START_DRAIN = `Start Drain`;
    this.STOP_DRAIN = `Stop Drain`;
    this.RESYNC = `Resync`;
    /* Prometheus wording */
    this.RECREATE = `Recreate`;
    this.EXPIRE = `Expire`;

    this.START = `Start`;
    this.STOP = `Stop`;
    this.REDEPLOY = `Redeploy`;
    this.RESTART = `Restart`;

    this.REMOVE_SCHEDULING = `Remove Scheduling`;
    this.PROMOTE = `Promote`;
    this.DEMOTE = `Demote`;

    this.START_UPGRADE = `Start Upgrade`;

    this.ACTIVATE = `Activate`;
    this.DEACTIVATE = `Deactivate`;

    this.ATTACH = `Attach`;
    this.CONNECT = `Connect`;
    this.DISCONNECT = `Disconnect`;
    this.RECONNECT = `Reconnect`;
    this.ADD_STORAGE = `Add Storage`;

    this.NFS_EXPORT = `Create NFS Export`;
    this.VIEW = `View`;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SucceededActionLabelsI18n {
  /* This service is required as the i18n polyfill does not provide static
  translation
  */
  CREATED: string;
  DELETED: string;
  ADDED: string;
  REMOVED: string;
  EDITED: string;
  CANCELED: string;
  PREVIEWED: string;
  MOVED: string;
  EXPORT: string;
  IMPORT: string;
  COPIED: string;
  CLONED: string;
  DEEP_SCRUBBED: string;
  DESTROYED: string;
  FLATTENED: string;
  MARKED_DOWN: string;
  MARKED_IN: string;
  MARKED_LOST: string;
  MARKED_OUT: string;
  PROTECTED: string;
  PURGED: string;
  RENAMED: string;
  RESTORED: string;
  REWEIGHTED: string;
  ROLLED_BACK: string;
  SCRUBBED: string;
  SHOWED: string;
  TRASHED: string;
  UNPROTECTED: string;
  CHANGE: string;
  RECREATED: string;
  EXPIRED: string;
  MOVE: string;
  START: string;
  STOP: string;
  REDEPLOY: string;
  RESTART: string;

  constructor() {
    /* Create a new item */
    this.CREATED = `Created`;

    /* Destroy an existing item */
    this.DELETED = `Deleted`;

    /* Add an existing item to a container */
    this.ADDED = `Added`;

    /* Remove an item from a container WITHOUT deleting it */
    this.REMOVED = `Removed`;

    /* Make changes to an existing item */
    this.EDITED = `Edited`;
    this.CANCELED = `Canceled`;
    this.PREVIEWED = `Previewed`;
    this.MOVED = `Moved`;

    /* Non-standard actions */
    this.CLONED = `Cloned`;
    this.COPIED = `Copied`;
    this.DEEP_SCRUBBED = `Deep Scrubbed`;
    this.DESTROYED = `Destroyed`;
    this.FLATTENED = `Flattened`;
    this.MARKED_DOWN = `Marked Down`;
    this.MARKED_IN = `Marked In`;
    this.MARKED_LOST = `Marked Lost`;
    this.MARKED_OUT = `Marked Out`;
    this.PROTECTED = `Protected`;
    this.PURGED = `Purged`;
    this.RENAMED = `Renamed`;
    this.RESTORED = `Restored`;
    this.REWEIGHTED = `Reweighted`;
    this.ROLLED_BACK = `Rolled back`;
    this.SCRUBBED = `Scrubbed`;
    this.SHOWED = `Showed`;
    this.TRASHED = `Moved to Trash`;
    this.UNPROTECTED = `Unprotected`;
    this.CHANGE = `Change`;

    /* Prometheus wording */
    this.RECREATED = `Recreated`;
    this.EXPIRED = `Expired`;

    this.START = `Start`;
    this.STOP = `Stop`;
    this.REDEPLOY = `Redeploy`;
    this.RESTART = `Restart`;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TimerServiceInterval {
  TIMER_SERVICE_PERIOD: number;

  constructor() {
    this.TIMER_SERVICE_PERIOD = 5000;
  }
}

export const SSL_PROTOCOLS = ['TLSv1.2', 'TLSv1.3'];

export const SSL_CIPHERS = [
  'ECDHE',
  'ECDSA',
  'AES128',
  'GCM',
  'SHA256',
  'RSA',
  'AES256',
  'SHA384',
  'CHACHA20',
  'POLY1305',
  'DHE'
];

export const USER = 'user';
export const VERSION_PREFIX = 'ceph version';

export const CEPHFS_MIRRORING_PAGE_HEADER = {
  title: `CephFS Mirroring`,
  description: `Centralised view of all CephFS Mirroring relationships.`
};
