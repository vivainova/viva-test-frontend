"use client"

import * as React from "react"
import { create, delclient, update, lists } from "@/services/api.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"





export function DataTable() {

    interface Clientes {
        id: string
        email: string
        name: string
        photoUrl: string
        enabled: boolean
        createdAt: string
        updatedAt: string
    }





    const columns: ColumnDef<Clientes>[] = [
        {
            accessorKey: "name",
            meta: "Nome",
            header: "Nome",
            cell: ({ row }) => (
                <div className="flex items-center">
                    <Avatar>
                        <AvatarImage src={row.original.photoUrl} alt="Avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 capitalize">{row.getValue("name")}</div>
                </div>
            ),
        },
        {
            accessorKey: "email",
            meta: "E-mail",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "createdAt",
            meta: "Criado",
            header: "Criado",
            cell: ({ row }) => {
                const createdAtDate = new Date(row.original.createdAt)
                const formattedCreatedAt = createdAtDate.toLocaleString()
                return <div className="capitalize">{formattedCreatedAt}</div>
            },
        },
        {
            accessorKey: "updatedAt",
            meta: "Atualizado",
            header: "Atualizado",
            cell: ({ row }) => {
                const updatedAtDate = new Date(row.original.updatedAt)
                const formattedUpdatedAt = updatedAtDate.toLocaleString()

                return <div className="capitalize">{formattedUpdatedAt}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const Clientes = row.original

                const handleDeleteConfirmation = async () => {
                    const jwt = localStorage.getItem('jwtToken');

                    if (jwt) {
                        try {
                            const response = await delclient(jwt, Clientes.id);
                            fetchData()
                        } catch (error) {
                            console.log(error)

                        }
                    }
                };


                const [selectedClient, setSelectedClient] = useState<Clientes | null>(null);

                const handleEditClick = (client: Clientes) => {
                    setSelectedClient(client);
                };

                const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const jwt = localStorage.getItem('jwtToken');
                    const idclient = selectedClient?.id as string;
                    const formData = new FormData(e.currentTarget);
                    const email = formData.get('email') as string;
                    const name = formData.get('name') as string;
                    const photoUrl = formData.get('photoUrl') as string;


                    if (jwt) {
                        try {
                            const response = await update(jwt, idclient, name, email, photoUrl);
                            router.refresh()
                            fetchData()

                        } catch (error) {
                            console.log(error)
                            if (error instanceof Response && error.status === 401) {
                                router.push("/");
                            } else {
                                setErrorMessage("Contate o Administrador.");
                            }
                        }
                    } else {
                        router.push("/");
                    }
                };


                return (
                    <Dialog>
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir Menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(Clientes.id)}
                                    >
                                        Copiar ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DialogTrigger>
                                        <DropdownMenuItem key={Clientes.id} onClick={() => handleEditClick(Clientes)}>Editar</DropdownMenuItem>
                                    </DialogTrigger>
                                    <AlertDialogTrigger>
                                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Atualizar Client</DialogTitle>
                                    <DialogDescription>
                                        Atualize as informações do cliente que deseja alterar e aperte em Atualizar quando estiver pronto.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleEdit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Nome*
                                            </Label>
                                            <Input
                                                name="name"
                                                id="name"
                                                placeholder="Lucas Oliveira"
                                                className="col-span-3"
                                                defaultValue={Clientes.name}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">
                                                E-mail*
                                            </Label>
                                            <Input
                                                name="email"
                                                id="email"
                                                placeholder="lucas@ig.com.br"
                                                className="col-span-3"
                                                defaultValue={Clientes.email}
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="photoUrl" className="text-right">
                                                Url da Foto
                                            </Label>
                                            <Input
                                                name="photoUrl"
                                                id="photoUrl"
                                                placeholder="https://picsum.photos/200/300?random=1"
                                                className="col-span-3"
                                                defaultValue={Clientes.photoUrl}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <div className="flex items-center">
                                            {errorMessage && <p className="px-5 text-red-600">{errorMessage}</p>}
                                            <Button type="submit">Atualizar</Button>
                                        </div>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza que deseja remover {Clientes.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita e ira remover o usuário de nossos servidores.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirmation}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Dialog>
                )

            },
        },
    ]




    const [data, setData] = useState<Clientes[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const jwt = localStorage.getItem('jwtToken');


    const fetchData = async () => {
        try {
            if (jwt) {
                const response = await lists(jwt, offset.toString());
                if (response) {
                    setData(response);
                }
            }
        } catch (error) {
            console.log(error)
            if (error instanceof Response && error.status === 401) {
                router.push("/");
            } else {

            }
        }
    };

    useEffect(() => {
        fetchData()
        if (!!data) {
            fetchData();
        }
    }, [offset, jwt]);

    const handlePrevClick = () => {
        const newOffset = Math.max(0, offset - limit);
        setOffset(newOffset);
    };

    const handleNextClick = () => {
        const newOffset = offset + limit;
        setOffset(newOffset);
    };


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })



    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const jwt = localStorage.getItem('jwtToken');
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;
        const photoUrl = formData.get('photoUrl') as string;
        let errorMessage = "";

        if (jwt) {
            try {
                const response = await create(jwt, name, email, photoUrl);
                router.refresh()
                fetchData()
            } catch (error: any) {
                console.log(error);
                if (error.status === 401) {
                    router.push("/");
                } else if (error.status === 400) {
                    if (error.message === "Email already exists") {
                        errorMessage = "E-mail já cadastrado.";
                    } else {
                        errorMessage = "Faltam dados requeridos.";
                    }
                } else {
                    errorMessage = "Contate o Administrador.";
                }
                setErrorMessage(errorMessage);
            }
        }
    };





    return (
        <Dialog>
            <AlertDialog>

                <div className="w-full">
                    <div className="flex items-center py-4 gap-2">
                        <Input
                            placeholder="Filtrar por email..."
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("email")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        <DialogTrigger className="border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2">
                            Criar Cliente
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Criar Cliente</DialogTitle>
                                <DialogDescription>
                                    Coloque as informações do cliente novo e aperte em Salvar quando estiver pronto.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Nome*
                                        </Label>
                                        <Input
                                            name="name"
                                            id="name"
                                            placeholder="Lucas Oliveira"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            E-mail*
                                        </Label>
                                        <Input
                                            name="email"
                                            id="email"
                                            placeholder="lucas@ig.com.br"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="photoUrl" className="text-right">
                                            Url da Foto
                                        </Label>
                                        <Input
                                            name="photoUrl"
                                            id="photoUrl"
                                            placeholder="https://picsum.photos/200/300?random=1"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <div className="flex items-center">
                                        {errorMessage && <p className="px-5 text-red-600">{errorMessage}</p>}
                                        <Button type="submit">Adicionar</Button>
                                    </div>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.columnDef.meta as string}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            Sem resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevClick}
                                disabled={offset === 0}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextClick}
                                disabled={!data || data.length < limit}
                            >
                                Proximo
                            </Button>
                        </div>
                    </div>
                </div>
            </AlertDialog>
        </Dialog>
    )
}
