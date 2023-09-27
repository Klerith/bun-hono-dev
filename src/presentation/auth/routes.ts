import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';


export const authRoutes = new Hono();



authRoutes.post( '/login',
  zValidator( 'form', z.object( {
    email: z.string().email(),
    password: z.string().min( 6 ),
  })), async ( c ) => {

    const { email, password } = await c.req.parseBody() as any;

    const resp = await AuthService.login( email, password );

    return c.json( resp );
    // return c.json( {
    //   message: 'login',
    //   body: { email, password },
    // } );
  } );



  authRoutes.post( '/register',
  zValidator( 'form', z.object( {
    name: z.string(),
    email: z.string().email(),
    password: z.string().min( 6 ),
  })), async ( c ) => {

    const { email, password, name } = await c.req.parseBody() as any;

    const resp = await AuthService.register( name, email, password );

    return c.json( resp );
  } );

