const status = [
    {
        id: 1,
        name: 'ACTIVO'
    },
    {
        id: 2,
        name: 'INACTIVO'
    }
];
exports.status = status;
exports.findStatusById = function (id) {
    return status.filter(p => p.id === id)[0];
}



const documentTypes = [
    {
        id: 1,
        name: 'Cédula de ciudadanía'
    },
    {
        id: 2,
        name: 'Tarjeta de identidad'
    },
    {
        id: 3,
        name: 'Registro civil'
    },
    {
        id: 4,
        name: 'NIT'
    },
    {
        id: 5,
        name: 'Otro'
    }
];
exports.documentTypes = documentTypes;
exports.findDocumentTypeById = function (id) {
    return documentTypes.filter(p => p.id === Number(id))[0];
}