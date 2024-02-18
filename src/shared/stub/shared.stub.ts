export const paginatedResultStub = (result: any) => ({
  total: 1,
  currentPage: 1,
  nextPage: null,
  previousPage: null,
  totalPages: 1,
  data: [result],
});
