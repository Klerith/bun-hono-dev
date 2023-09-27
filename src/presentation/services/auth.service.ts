import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';

import { prisma } from '../../data';
import { envs } from '../../config/envs';



export class AuthService {

  private constructor() { }

  static async createToken( payload: any ) {
    return sign( payload, envs.SECRET_JWT );
  }


  static async login( email: string, password: string ) {

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if ( !user ) {
      throw new HTTPException( 400, { message: 'Email or password incorrect - email' } );
    }

    const isMatch = Bun.password.verifySync( password, user.password );

    if ( !isMatch ) {
      throw new HTTPException( 400, { message: 'Email or password incorrect' } );
    }

    

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: await this.createToken( { id: user.id } )
    };
  }

  static async register( name: string, email: string, password: string ) {
    
    const existsEmail = await prisma.user.findFirst( {
      where: { email }
    } );

    if ( existsEmail ) {
      throw new HTTPException( 400, { message: 'Email already exists' } );
    }

    try {


      const user = await prisma.user.create( {
        data: {
          name,
          email,
          password: await Bun.password.hash( password ),
        },
      } );

      

      return {
        user: { id: user.id, name: user.name, email: user.email },
        token: await this.createToken( { id: user.id } )
      };


    } catch ( error ) {
      throw new HTTPException( 500 );
    }

  }

}