import type React from "react";
import { useWatch, type Control } from "react-hook-form";

export const TaxIdField: React.FC<{ control: Control<any>; register: any }> = ({ control, register }) => {

    const customerType = useWatch({
        control, name: 'customerType'
    })

    if (customerType !== 'business') return null;
    return (
        <div>
            <label>Mã số thuế doanh nghiệp:</label>
            <input
                {...register('taxId', { required: 'Enter taxId, please!' })}
                placeholder="Nhập mã số thuế..."
            />
        </div>
    );
}