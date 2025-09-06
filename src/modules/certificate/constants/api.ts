export const certificateEndpoints = {
    certificateEndPoint: (id: string)=> `/courses/${id}/certificate`,
    updateCertificateTemplate: (id: string)=> `/courses/${id}/certificate/template`,
    updateCertificateFields: (id: string)=> `/courses/${id}/certificate/fields`,
}