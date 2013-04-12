# express-boilerplate
===================

Express.js boilerplate integrated Passport, Nodemailer, Initializr.

This project stole [node-boilerplate](https://github.com/robrighter/node-boilerplate#node-boilerplate-version-2)'s idea, which I think is the most easy-use boilerplate ever.

However, I feel it could be more useful, if some most popular components were integrated as those are almost always needed when you start a project. Therefore, I created this boilerplate based one the latest express.js (>= 3.1.0) and node.js (>= 0.10.0) and integrated [Passport's Local-Strategy](http://passportjs.org/), [Nodemailer](https://github.com/andris9/Nodemailer) and [Initializr's Bootstrap boilerplate]((http://www.initializr.com/).

===================

## Development
After you initialize your project, you'll have a basic app with a simple User model (email, password), signup/login/logout APIs, Passport Local-Strategy authentication in Twitter-Bootstrap style.

It supports the latest version of Express.js and Node.js and the others, as I didn't restrict the version. So please let me know, if there's anything broken.
A list of dependencies:
```
├── bcrypt@0.7.5
├── connect-flash@0.1.0
├── connect-mongo@0.3.2
├── express@3.1.1
├── jade@0.28.2
├── mongoose@3.6.4
├── passport@0.1.16
└── passport-local@0.1.6
```

## Resources
1. [node-boilerplate](https://github.com/robrighter/node-boilerplate)
2. [Password Authentication with Mongoose Part 1](http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1)
3. [cdnjs - the missing cdn](http://cdnjs.com/)
4. [HTML 2 Jade Converter](http://html2jade.aaron-powell.com/)
