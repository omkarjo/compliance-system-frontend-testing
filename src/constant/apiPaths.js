export const authApiPaths = {
  login: "/api/auth/login",
  register: "/users/",
  me: "/api/users/me",
  search: "/api/users/search",
};

export const taskApiPaths = {
  createTask: "/api/tasks/",
  getTask: "/api/tasks/",
  getTaskByIdPrefix: "/api/tasks/",
  updateTaskPrefix: "/api/tasks/",
};

export const documentApiPaths = {
  getDocument: "/api/documents/",
  uploadDocument: "/api/documents/upload",
  deleteDocument: "/api/documents/",
  getDocumentByIdPrefix: "/api/documents/",
};

export const auditLogApiPaths = {
  getAuditLog: "/api/audit/logs",
};


export const limitedPartnersApiPaths = {
    getLimitedPartners: "/api/lps/",
    createLimitedPartner: "/api/lps/",
    searchLimitedPartners: "/api/lps/search/",
    getLimitedPartnerByIdPrefix: "/api/lps/",
    updateLimitedPartnerPrefix: "/api/lps/",
};