type Pagination = {
    pages: number,
    total: number,
    perPage: number,
    currentPage: number,
};

export default class PaginationHandler {
    private operators: Pagination;
    private validators: Pagination;
    private static instance: PaginationHandler;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        this.operators = { pages: 0, perPage: 0, currentPage: 0, total: 0 };
        this.validators = { pages: 0, perPage: 0, currentPage: 0, total: 0 };
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): PaginationHandler {
        if (!PaginationHandler.instance) {
            PaginationHandler.instance = new PaginationHandler();
        }

        return PaginationHandler.instance;
    }

    public lastPage() {

    }
}
