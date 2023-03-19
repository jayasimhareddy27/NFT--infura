
const projectId = '2NE5Kz8nyx9zbyFZkSEB2GpNpsp';
const projectSecret = '766112cb3d0292c20e17394cf64829fb';
const auth ='Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export default auth;