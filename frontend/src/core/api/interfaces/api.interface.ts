export interface ApiEndpoint {
    url: string;
    methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
    description: string;
}


// export type ModuleEndpoints<T extends keyof any> = {
//     [K in T]: ApiEndpoint;
// };
export type ModuleEndpoints<T extends keyof any> = {
    [K in T]: ApiEndpoint;
};