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
  searchTask: "/api/tasks/search",
  deleteTaskPrefix: "/api/tasks/",
};

export const documentApiPaths = {
  getDocument: "/api/documents/",
  uploadDocument: "/api/documents/upload",
  deleteDocumentPrefix: "/api/documents/",
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
  bulkUploadLimitedPartner: "/api/lps/bulk-upload/",
};

export const entityApiPaths = {
  getEntities: "/api/entities/",
  create: "/api/entities/",
  update: "/api/entities/",
  search: "/api/entities/search",
  getEntityByIdPrefix: "/api/entities/",
};

export const fundApiPaths = {
  getFunds: "/api/funds/",
  createFund: "/api/funds/",
  getFundByIdPrefix: "/api/funds/",
  updateFundPrefix: "/api/funds/",
  searchFunds: "/api/funds/search",
};

export const portfolioCompaniesApiPaths = {
  get: "/api/portfolio-companies/",
  create: "/api/portfolio-companies/onboard",
  search: "/api/portfolio-companies/search",
  delete: "/api/portfolio-companies/",
  idPrefix: "/api/portfolio-companies/",
};

export const fundEntityApiPaths = {
  get: "/api/fund-entities/",
  create: "/api/fund-entities/",
  getFundEntitiesByFundIdPrefix: "/api/fund-entities/funds/",
  getFundEntityByFundIdSuffix: "/entities",
};

export const drawdownApiPaths = {
  get: "/api/drawdowns/",
  create: "/api/drawdowns/",
  generateDrawdownReport: "/api/drawdowns/generate_drawdowns",
  getDrawdownByIdPrefix: "/api/drawdowns/",
  updateDrawdownPrefix: "/api/drawdowns/",
  searchDrawdowns: "/api/drawdowns/search",
  deleteDrawdownPrefix: "/api/drawdowns/",
  preview: "/api/drawdowns/preview",
};


export const unitAllotmentApiPaths = {
  generateUnitAllotments: "/api/unit-allotments/generate",
  get: "/api/unit-allotments",
  getByIdPrefix: "/api/unit-allotments/"
};
