import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const { PORT } = process.env;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Contacts API',
            version: '1.0.0',
            description: 'API documentation for managing contacts and users',
        },
        servers: [
            {url: [`http://localhost:${PORT}`],},
            {url: [`https://nodebackend-bymv.onrender.com/api`],},
        ],
        components: {
            schemas: {
                Contact: {
                    type: 'object',
                    required: ['name', 'email', 'phone'],
                    properties: {
                        _id: {type:'string', description:'The auto-generated ID of the contact'},
                        name: {type:'string', index:1, description:'The name of the contact'},
                        email: {type:'string', description:'The email of the contact'},
                        phone: {type:'string', description:'The phone of the contact'},
                        favorite: {type:'boolean', description:'The marked favorites in the contact'},
                    },
                },
                User: {
                    type: 'object',
                    required: ['password', 'email', 'verificationToken'],
                    properties: {
                        _id: {type:'string', description:'The auto-generated ID of the user'},
                        password: {type:'string', description:'The password of the user'},
                        email: {type:'string', unique: true, description:'The email of the user'},
                        subscription: {type:'string', default:'starter', enum: ["starter", "pro", "business"], description:'The subscription of the user'},
                        token: {type:'string', default:null, description:'The token of the user'},
                        avatarURL: {type:'string', description:'The avatarURL of the user'},
                        verify: {type:'boolean', default:false, description:'If the email of the user is verified'},
                        verificationToken: {type:'string', description:'The verification token of the email of the user'},
                    },
                }
            },
        },
    },
    apis: ['./routes/api/*.js', './models/*.js'],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export { swaggerSpecs, swaggerUi };