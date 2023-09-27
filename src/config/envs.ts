import {get} from 'env-var';



export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  SECRET_JWT: get('SECRET_JWT').required().asString(),


}