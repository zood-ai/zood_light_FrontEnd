import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { SelectComp } from '@/components/custom/SelectItem'
import { DatePickerDemo } from '@/components/custom/DatePickerDemo'
import { CheckboxWithText } from '@/components/custom/CheckboxWithText'
import { Input } from '@/components/ui/input'
import Previews from '@/components/custom/ImgFilesDND'
import { useNavigate, useParams } from 'react-router-dom'
import createCrudService from '@/api/services/crudService'
import { selectOptions } from '@/constant/constant'
import MultiSelect from '@/components/MultiSelect'

//  schema
const formSchema = z.object({
  label: z.string(),
  priority: z.string(),
  priorityy: z.any(),
  status: z.any(),
  NationalId: z.any(),
  uploadId: z.any(),
  checkBoxC: z.any(),
  file: z.any(),
})

interface SellerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: any
  modalType?: string
}

const AddEditModal: React.FC<SellerDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
  modalType,
}) => {
  const params = useParams()
  const allServiceUser = createCrudService<any>('seller')
  const { useGetById, useUpdate, useCreate } = allServiceUser
  // const paramsx = params.id !== "add" ? params.id : "";

  // const { data: allDataUserById, isLoading } = useGetById(
  //   paramsx ?? ""
  // )
  const { mutate: createNewUser } = useCreate()
  const { mutate: updateDataUserById } = useUpdate()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  const [initialFiles, setInitialFiles] = useState<any[]>([]) // For edit mode
  const title = modalType === 'Add' ? 'Add New' : 'Edit'

  const defaultValues = useMemo(
    () => (modalType === 'Add' ? {} : initialData),
    [initialData, modalType]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (modalType === 'Add') {
      form.reset({})
    }
    if (modalType === 'Edit') {
      form.reset(initialData)
    }
  }, [initialData, form, modalType])

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    if (modalType === 'Add') {
      await createNewUser(values, {
        onSuccess: () => {
          setLoading(false)
          onClose()
        },
        onError: () => {
          setLoading(false)
        },
      })
    } else {
      await updateDataUserById(
        { id: 2, data: values },
        {
          onSuccess: () => {
            setLoading(false)
            onClose()
          },
          onError: () => {
            setLoading(false)
          },
        }
      )
    }
  }

  // Memoize handleFilesChange
  const handleFilesChange = useCallback((newFiles: any[]) => {
    setFiles(newFiles)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[98vw] md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className='px-s4 my-5'
          >
            <div className='grid h-[300px] grid-cols-1 gap-y-4 overflow-x-hidden overflow-y-scroll px-2 md:w-auto md:grid-cols-2 md:gap-4'>
              <FormField
                control={form.control}
                name='label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <SelectComp
                        // multi
                        {...field}
                        options={selectOptions}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='priorityy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={selectOptions}
                        onValueChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePickerDemo {...field} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='checkBoxC'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload ID</FormLabel>
                    <FormControl>
                      <CheckboxWithText {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Previews
                        initialFiles={files}
                        onFilesChange={(e) => {
                          field.onChange(e)
                          setFiles(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-full mt-10 flex items-center justify-center space-x-4 md:justify-between md:px-8'>
              <Button
                size='lg'
                variant='default'
                type='submit'
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button size='lg' variant='outline' onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default AddEditModal
