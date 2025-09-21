import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ActiveAccount() {
  const [businessReference, setBusinessReference] = useState('');
  const [months, setMonths] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!businessReference) return;
    setLoading(true);
    try {
      const res = await axios.post(
        'https://api.zood.ai/api/v1/auth/extendBusiness',
        {
          business_reference: businessReference,
          months: Number(months),
        }
      );

      if (res.status === 200) {
        if (res.data.success === true) {
          toast({
            title: 'نجاح',
            description: 'تم التفعيل بنجاح',
            duration: 3000,
            variant: 'default',
          });
        } else {
          toast({
            title: 'فشل',
            description: res.data.message,
            duration: 3000,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setLoading(false);
      setBusinessReference('');
      setMonths('');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[419px] flex flex-col gap-4">
        <Input
          dir="rtl"
          type="text"
          defaultValue={businessReference}
          value={businessReference}
          onChange={(e) => setBusinessReference(e.target.value)}
          className=" w-full placeholder:text-[14px] placeholder:font-[600] placeholder:text-[#868686] px-2 py-4 border border-[#E6E6E6] rounded-sm h-[56px] "
          placeholder="الرقم التعريفي"
        />
        <div
          dir="rtl"
          className="flex flex-col flex-grow gap-y-2 max-sm:w-full"
        >
          <Label className="align-right" htmlFor="business_type_id">
            مدة الاشتراك{' '}
          </Label>
          <Select
            value={months}
            dir="rtl"
            onValueChange={(value) => setMonths(value)}
          >
            <SelectTrigger className="w-full border-[#DCDBDB]">
              <SelectValue placeholder="أختر  مدة الاشتراك" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'3'}>لمدة 3 أشهر</SelectItem>
                <SelectItem value={'6'}>لمدة 6 أشهر</SelectItem>
                <SelectItem value={'12'}>لمدة سنة</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={businessReference.length !== 6 || loading}
          onClick={() => handleSubmit()}
          className="px-2 py-4 text-base font-[600] text-[#FFFFFF] rounded-sm bg-[#7272F6] h-[56px]"
        >
          {loading ? 'جاري التحميل...' : 'تفعيل'}
        </Button>
      </div>
    </div>
  );
}
