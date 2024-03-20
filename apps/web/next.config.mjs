import MillionCompiler from '@million/lint';
/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@acme/db"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },


    ],
  }
};


export default MillionCompiler.next({ 
  rsc: true // if used in the app router mode
})(config);