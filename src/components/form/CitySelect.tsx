import { useEffect } from "react";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";

interface CitySelectProps {
    control: Control<any>;
    setValue: UseFormSetValue<any>;
    register: any;
}

export const CitySelect: React.FC<CitySelectProps> = ({ control, setValue, register }) => {
    // chi lang nghe truong country
    const country = useWatch({
        control, name: 'country'
    })
    console.log('📫CitySelect.tsx:12/(country):', country)

    useEffect(() => {
        setValue('city', '')
    }, [country, setValue])

    if (!country) {
        return <p className="text-gray-400">Vui lòng chọn quốc gia trước</p>;
    }

    return (
        <div>
            <label>Thành phố ({country}):</label>
            <select {...register('city')}>
                <option value="">-- Chọn thành phố --</option>
                {country === 'VN' ? (
                    <>
                        <option value="HN">Hà Nội</option>
                        <option value="HCM">Hồ Chí Minh</option>
                        <option value="DN">Đà Nẵng</option>
                    </>
                ) : (
                    <>
                        <option value="NYC">New York</option>
                        <option value="LA">Los Angeles</option>
                    </>
                )}
            </select>
        </div>
    )
}