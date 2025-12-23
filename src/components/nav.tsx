import { Link } from 'react-router-dom';
import { IconChevronDown } from '@tabler/icons-react';
import { Button, buttonVariants } from './custom/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';
import useCheckActiveNav from '@/hooks/use-check-active-nav';
import { SideLink } from '@/data/sidelinks';
import useDirection from '@/hooks/useDirection';
import { useTranslation } from 'react-i18next';

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  links: SideLink[];
  closeNav: () => void;
}

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.i18n}-${rest.href}`;
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      );

    return <NavLink {...rest} key={key} closeNav={closeNav} />;
  };
  const isRtl = useDirection();
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b  bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none ',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav
          dir={isRtl ? 'rtl' : 'ltr'}
          className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
        >
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  );
}

interface NavLinkProps extends SideLink {
  subLink?: boolean;
  closeNav: () => void;
}

function NavLink({
  title,
  i18n,
  icon,
  icon1,
  icon2,
  label,
  href,
  closeNav,
  subLink = false,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();
  const isRtl = useDirection();
  return (
    <Link
      to={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: checkActiveNav(href) ? 'ghost' : 'ghost',
          size: 'sm',
        }),
        `h-12 justify-start text-wrap rounded-none px-6  ${checkActiveNav(href)
          ? 'bg-[#EAEBF5] rounded-[8px] mx-2 ps-[16px] hover:bg-[#EAEBF5]'
          : ''
        }`,
        subLink && 'h-10 w-full border-l border-l-slate-500 px-2'
      )}
      aria-current={checkActiveNav(href) ? 'page' : undefined}
    >
      <div className={`${isRtl ? 'ml-2' : 'mr-2'}`}>
        <span
          className={`${checkActiveNav(href) ? 'text-main ' : 'text-secText'}`}
        >
          <i>
            {/* {false?icon1:icon2} */}
            {!(icon1 && icon2) && icon}
            {checkActiveNav(href) ? icon2 : icon1}
            {/* {icon}  */}
          </i>
        </span>
      </div>
      <span
        className={` ${checkActiveNav(href) ? 'font-bold text-main' : 'text-secText'
          }`}
      >
        {/* {title} */}
        {t(i18n)}
      </span>
      {label && (
        <div className="font-bold ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
          {label}
        </div>
      )}
    </Link>
  );
}

function NavLinkDropdown({
  title,
  i18n,
  icon,
  label,
  sub,
  closeNav,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();
  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));
  const isRtl = useDirection();
  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'text-secText group h-12 w-full justify-start rounded-none px-6'
        )}
      >
        <div className={` ${isRtl ? 'ml-2' : 'mr-2'}`}>
          {icon}
        </div>
        {
          <p className="text-[15px]">
            {t(i18n)}
          </p>
        }
        {label && (
          <div className="ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <IconChevronDown stroke={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsibleDropdown" asChild>
        <ul>
          {sub!.map((sublink) => (
            <li key={sublink.i18n} className="my-1 ml-8">
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, i18n, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            `h-12 w-12 ${checkActiveNav(href)
              ? 'bg-[#EAEBF5] rounded-[8px]  hover:bg-[#EAEBF5]'
              : ''
            } `
          )}
        >
          <span
            className={`${checkActiveNav(href) ? 'text-main' : 'text-secText'}`}
          >
            {icon}
          </span>{' '}
          {/* <span className="sr-only">{title}</span> */}
          <span className="sr-only">{t(i18n)}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {/* {title} */}
        {t(i18n)}
        {label && (
          <span className="ml-auto text-muted-foreground">{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, i18n, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size="icon"
              className="h-12 w-12 text-secText"
            >
              {icon}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {t(i18n)}{' '}
          {label && (
            <span className="ml-auto text-muted-foreground">{label}</span>
          )}
          <IconChevronDown
            size={18}
            className="-rotate-90 text-muted-foreground"
          />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" sideOffset={4}>
        <DropdownMenuLabel>
          {/* {title} {label ? `(${label})` : ''} */}
          {t(i18n)} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, i18n, icon, label, href }) => (
          <DropdownMenuItem key={`${t(i18n)}-${href}`} asChild>
            <Link
              to={href}
              className={`${checkActiveNav(href) ? 'bg-secondary' : ''}`}
            >
              {icon} <span className="ml-2 max-w-52 text-wrap">{t(i18n)}</span>
              {label && <span className="ml-auto text-xs">{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
