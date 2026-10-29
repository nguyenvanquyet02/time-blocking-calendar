import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CitySelect } from '../components/form/CitySelect';
import { TaxIdField } from '../components/form/TaxIdField';


interface FormValues {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  customerType: 'personal' | 'business';
  taxId?: string;
}
const LearnFormControl: React.FC = () => {
  const { register, control, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      phone: '',
      country: '',
      city: '',
      customerType: 'business'
    }
  })

  const renderCount = useRef(0)
  renderCount.current += 1;
  const onSubmit = (data: FormValues) => {
    console.log(data)
  }
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mx-auto max-w-[1000px] block'>
        <div className="p-2 bg-yellow-100 text-xs">
          Số lần Form Cha Re-render: <strong>{renderCount.current}</strong>
        </div>

        <div>
          <label>Họ và tên:</label>
          <input {...register('fullName')} placeholder="Nhập tên..." />
        </div>

        <div>
          <label>Quốc gia:</label>
          <select {...register('country')}>
            <option value="">-- Chọn quốc gia --</option>
            <option value="VN">Việt Nam</option>
            <option value="US">Hoa Kỳ</option>
          </select>
        </div>

        {/* Trường phụ thuộc được đưa vào Component con */}
        <CitySelect control={control} register={register} setValue={setValue} />
        {/* Trường điều kiện động: Ví dụ Doanh nghiệp cần Mã số thuế */}
        <TaxIdField control={control} register={register} />
        <button type="submit">Lưu thông tin</button>
      </form>

    </div>
  );
};

export default LearnFormControl;
