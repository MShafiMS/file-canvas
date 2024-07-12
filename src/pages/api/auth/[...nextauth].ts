import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: '1043947360898-c59fjnfavmd8jg7kjmk5rr8h32qqgedt.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    GitHubProvider({
      clientId: 'Ov23li8MfQ7AusjAr8KO',
      clientSecret: '6ee4efe9a1e5f6ff96044bfef72b8ec88c7b8539',
    }),
  ],
  // pages: {
  //   signIn: '/auth/signin',
  //   // signOut: '/auth/signout',
  //   // error: '/auth/error', // Error code passed in query string as ?error=
  //   // verifyRequest: '/auth/verify-request', // (used for check email message)
  //   // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
};

export default NextAuth(authOptions);
