'use client'
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    Hydrate
} from '@tanstack/react-query'
export {
    ProgressSpinner, DataTable, QueryClientProvider, useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
}