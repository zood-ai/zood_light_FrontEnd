import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CustomModal from "@/components/ui/custom/CustomModal";
import moment from "moment";
import { formModifiersSchema } from "./schema/Schema";
import useModifiersHttp from "./queriesHttp/useModifiersHttp";
import { IModifiersList } from "./types/types";
import ContentModifier from "./components/ContentModifier";
const Modifiers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [modalName, setModalName] = useState("");
    const [rowData, setRowData] = useState<any>();

    const columns: ColumnDef<IModifiersList>[] = [
        {
            accessorKey: "name",
            header: () => <div>Name</div>,
            cell: ({ row }) => <>{row.getValue("name")}</>,
        },
        {
            accessorKey: "reference",
            header: () => <div>Reference</div>,
            cell: ({ row }) => <>{row.getValue("reference")}</>,
        },
        {
            accessorKey: "options",
            header: () => <div>Options</div>,
            cell: ({ row }: any) => (
                <div
                    className={`${row.getValue("options")?.length ? "" : "text-primary"}`}
                >
                    Options ({row.getValue("options")?.length})
                </div>
            ),
        },
        {
            accessorKey: "products",
            header: () => <div>Products</div>,
            cell: ({ row }: any) => (
                <div
                    className={`${row.getValue("products")?.length ? "" : "text-primary"
                        }`}
                >
                    Products ({row.getValue("products")?.length})
                </div>
            ),
        },

        {
            accessorKey: "created_at",
            header: () => <div>Created At</div>,
            cell: ({ row }: any) => (
                <>{moment(row.getValue("created_at")).format("LL") || "-"}</>
            ),
        },
    ];
    const onSubmit = (values: any) => {
        if (modalName == "Edit modifier") {
            EditModifer(values);
        } else {
            CreateModifier(values);
        }
    };
    const handleCloseSheet = () => {
        setIsOpen(false);
        setIsEdit(false);
        setModalName("");
        setRowData(undefined);
    };
    const defaultValues = {};
    const form = useForm<z.infer<typeof formModifiersSchema>>({
        resolver: zodResolver(formModifiersSchema),
        defaultValues,
    });

    const {
        ModifiersData,
        isLoadingModifiers,
        EditModifer,
        loadingEdit,
        loadingExport,
        DeleteModifier,
        loadingDelete,
        ExportModifier,
        CreateModifier,
        loadingCreate,
        isLoadingModifierOne
    } = useModifiersHttp({
        handleCloseSheet: handleCloseSheet,
        IdModifier: rowData?.id,
    });
    const handleConfirm = () => {
        if (modalName === "close edit") {
            handleCloseSheet();
        } else {
            // handle delete
            DeleteModifier(rowData?.id || "");
        }
    };
    return (
        <>
            <HeaderPage
                title="Modifiers"
                textButton="Add Modifier"
                exportButton
                loading={loadingExport}
                onClickAdd={() => {
                    setIsOpen(true);
                }}
                handleExport={() => { ExportModifier() }}
                handleImport={() => { }}
            />
            <HeaderTable />
            <CustomTable
                columns={columns}
                data={ModifiersData?.data || []}
                onRowClick={(row: any) => {
                    setRowData(row);
                    setIsEdit(true);
                    setIsOpen(true);
                }}
                loading={isLoadingModifiers}
                paginationData={ModifiersData?.meta}
            />
            <CustomSheet
                isOpen={isOpen}
                isEdit={isEdit}
                headerLeftText={isEdit ? "Edit Modifier" : "Add Modifier"}
                handleCloseSheet={handleCloseSheet}
                form={form}
                onSubmit={onSubmit}
                setModalName={setModalName}
                isLoading={loadingCreate || loadingEdit || loadingDelete}
                isLoadingForm={isLoadingModifierOne}
            >
                <><ContentModifier /></>
            </CustomSheet>
            <CustomModal
                modalName={modalName}
                setModalName={setModalName}
                handleConfirm={handleConfirm}
                deletedItemName={rowData?.name || ""}
            />
        </>
    );
};

export default Modifiers;
