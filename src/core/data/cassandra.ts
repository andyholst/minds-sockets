/**
 * Cassandra
 */

import * as _cassandra from 'cassandra-driver';

import * as config from '../../../config';

export class Cassandra {

  public client;

  constructor(){
    this.client = new _cassandra.Client({
      contactPoints: config.CASSANDRA.SERVERS,
      keyspace: config.CASSANDRA.KEYSPACE,
      credentials: { username: config.CASSANDRA.USERNAME, password: config.CASSANDRA.PASSWORD },
      localDataCenter: 'datacenter1', // TODO: make this a config value
      queryOptions: { consistency: _cassandra.types.consistencies.localQuorum },
      authProvider: new _cassandra.auth.PlainTextAuthProvider(config.CASSANDRA.USERNAME, config.CASSANDRA.PASSWORD),
    });
  }

}
