import React, { useEffect, useMemo } from 'react'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation()
  const languages = [
    {
      code: 'en',
      icon: 'https://img.icons8.com/?size=512&id=t3NE3BsOAQwq&format=png',
    },
    {
      code: 'ar',
      icon: 'https://img.icons8.com/emoji/48/000000/saudi-arabia-emoji.png',
    },
  ]

  // Set the initial language direction
  useEffect(() => {
    const currentLang = i18n.language || window.localStorage.i18nextLng || 'ar'
    document.documentElement.lang = currentLang
    document.documentElement.dir = i18n.dir(currentLang)
    document.body.dir = i18n.dir(currentLang)
  }, [i18n.language])

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code)
    document.documentElement.lang = code
    document.documentElement.dir = i18n.dir(code)
    document.body.dir = i18n.dir(code)
  }

  // Get the selected language icon using useMemo for optimization
  const selectedLang = useMemo(() => i18n.language || 'ar', [i18n.language])
  const selectedLangIcon = useMemo(
    () => languages.find((lang) => lang.code === selectedLang)?.icon,
    [selectedLang]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='bordear-gray-300 flex items-center space-x-2 border p-2 text-sm font-medium hover:bg-gray-100  hover:text-black focus:bg-gray-200 focus:text-black'
          aria-label='Language Selector'
        >
          {/* <span>{selectedLang.toUpperCase()}</span> */}
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={selectedLangIcon}
              alt={`${selectedLang.toUpperCase()} icon`}
            />
            <AvatarFallback>En</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-28'>
        <DropdownMenuGroup>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className='flex cursor-pointer items-center justify-center space-x-2'
            >
              <span>{lang.code.toUpperCase()}</span>
              <img
                src={lang.icon}
                className='h-5 w-5'
                alt={`${lang.code.toUpperCase()} icon`}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
