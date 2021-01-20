import * as async from 'async';
import { Di } from '../core/di/di';
import { Helpers } from '../helpers';
import { Bootstrap } from '../bootstrap';
import * as jwt from 'jsonwebtoken';
import * as config from '../../config';
import { readFileSync  } from 'fs';

export class Register {

  private redis = Di.get('data/redis');
  private cert = readFileSync('../../oauth-pub.key');

  constructor(private socket, private io){
    this.listen();
  }

  listen(){

    this.socket.on('register', (guid, access_token) => {

      if(!guid){
          console.log("[register][error]: guid not set (" + this.socket.id + ")");
          this.socket.emit('connect_error', 'Guid must be set..');
          return;
      }

      const cert = readFileSync('../../oauth-pub.key');
      jwt.verify(access_token, this.cert, (err, decoded) => {

        if(err){
          console.log('[jwt]: token not found');
          return; //token not found, could be a mobile user though
        }

        let id = decoded.jti;

        Helpers.getUserByAccessToken(id)
          .then((user_guid) => {
            console.log('guid is ' + user_guid);
            if(user_guid != guid){
              return;
            }

            Bootstrap.register(this.socket, user_guid);
          });

      });

    });
  }

}
