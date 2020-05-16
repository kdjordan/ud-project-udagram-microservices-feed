export const config = {
    "postgress": {
      "username": 'udagramjordan',
      "password": 'udagramjordanpass',
      "database": 'udagramjordan',
      "host": 'udagramjordan.cqk1udiwxavz.us-east-2.rds.amazonaws.com',
      "dialect": 'postgres'
    },
    "aws": {
      "aws_region": 'us-east-2',
      "aws_profile": 'default',
      "aws_media_bucket": 'udagramjordan-dev'
    },
    "jwt" : {
      "secret": 'GoDucks'
    }
  }
// export const config = {
//     "postgress": {
//       "username": process.env.POSTGRES_USERNAME,
//       "password": process.env.POSTGRES_PASSWORD,
//       "database": process.env.POSTGRES_DATABASE,
//       "host": process.env.POSTGRES_HOST,
//       "dialect": process.env.POSTGRES_DIALECT
//     },
//     "aws": {
//       "aws_region": process.env.AWS_REGION,
//       "aws_profile": process.env.AWS_PROFILE,
//       "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
//     },
//     "jwt" : {
//       "secret": process.env.SECRET_KEY
//     }
//   }
  