import { Hono } from 'hono'
import { authRoutes } from './presentation/auth/routes';
import { jwt } from 'hono/jwt';
import { prisma } from './data';
import { envs } from './config/envs';

const app = new Hono()



app.get('/', (c) => c.text('hola'))


// const token = 'mysecrettoken';
app.use( 'api/users', jwt({ secret: envs.SECRET_JWT }) );

app.route( 'api/auth', authRoutes );


app.get( 'api/users', async( c ) => {
  const users = await prisma.user.findMany();
  return c.json( users );
})


export default app
