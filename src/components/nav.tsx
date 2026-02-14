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
          className="grid gap-1 px-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
        >
          {links.map((link) => (
            <div key={`${link.i18n}-${link.href}`} className="py-0.5">
              {renderLink(link)}
            </div>
          ))}
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
  const isActive = checkActiveNav(href);
  return (
    <Link
      to={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
        }),
        `mx-2 h-11 justify-start rounded-md px-3 text-wrap transition-colors focus-visible:ring-2 focus-visible:ring-main ${
          isActive
            ? 'bg-muted font-semibold text-main'
            : 'text-secText hover:bg-muted/50'
        }`,
        subLink &&
          `mx-0 h-10 w-full rounded-md px-2 ${
            isRtl ? 'border-r border-r-slate-300' : 'border-l border-l-slate-300'
          }`
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`${isRtl ? 'ml-2.5' : 'mr-2.5'}`}>
        <span
          className={`${isActive ? 'text-main' : 'text-secText'} inline-flex items-center`}
        >
          <i>
            {/* {false?icon1:icon2} */}
            {!(icon1 && icon2) && icon}
            {isActive ? icon2 : icon1}
            {/* {icon}  */}
          </i>
        </span>
      </div>
      <span
        className={`text-[15px] leading-5 ${isActive ? 'font-semibold text-main' : 'font-medium text-secText'}`}
      >
        {/* {title} */}
        {t(i18n)}
      </span>
      {label && (
        <div
          className={cn(
            'font-bold rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground',
            isRtl ? 'mr-2' : 'ml-2'
          )}
        >
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
  icon1,
  icon2,
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
  const triggerIcon = isChildActive ? icon2 || icon1 || icon : icon1 || icon2 || icon;
  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          `group mx-2 h-11 w-auto justify-start rounded-md px-3 focus-visible:ring-2 focus-visible:ring-main ${
            isChildActive
              ? 'bg-muted font-semibold text-main'
              : 'text-secText hover:bg-muted/50'
          }`
        )}
      >
        <div className={` ${isRtl ? 'ml-2' : 'mr-2'}`}>
          {triggerIcon}
        </div>
        {
          <p className="text-[15px] font-medium leading-5">
            {t(i18n)}
          </p>
        }
        {label && (
          <div
            className={cn(
              'rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground',
              isRtl ? 'mr-2' : 'ml-2'
            )}
          >
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
        <ul
          className={cn(
            'mt-1 space-y-1',
            isRtl
              ? 'mr-4 border-r border-r-slate-200 pr-2'
              : 'ml-4 border-l border-l-slate-200 pl-2'
          )}
        >
          {sub!.map((sublink) => (
            <li key={sublink.i18n}>
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, i18n, icon, label, href, closeNav }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();
  const isActive = checkActiveNav(href);
  const isRtl = useDirection();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href}
          onClick={closeNav}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'icon',
            }),
            `h-10 w-10 rounded-md focus-visible:ring-2 focus-visible:ring-main ${
              isActive
                ? 'bg-muted text-main'
                : 'text-secText hover:bg-muted/50'
            }`
          )}
        >
          <span
            className={`${isActive ? 'text-main' : 'text-secText'}`}
          >
            {icon}
          </span>{' '}
          {/* <span className="sr-only">{title}</span> */}
          <span className="sr-only">{t(i18n)}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side={isRtl ? 'left' : 'right'} className="flex items-center gap-4">
        {/* {title} */}
        {t(i18n)}
        {label && (
          <span className="ml-auto text-muted-foreground">{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({
  title,
  i18n,
  icon,
  icon1,
  icon2,
  label,
  sub,
  closeNav,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav();
  const { t } = useTranslation();
  const isRtl = useDirection();

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));
  const triggerIcon = isChildActive ? icon2 || icon1 || icon : icon1 || icon2 || icon;

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-md focus-visible:ring-2 focus-visible:ring-main',
                isChildActive
                  ? 'bg-muted text-main'
                  : 'text-secText hover:bg-muted/50'
              )}
            >
              {triggerIcon}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={isRtl ? 'left' : 'right'} className="flex items-center gap-4">
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
      <DropdownMenuContent
        side={isRtl ? 'left' : 'right'}
        align="start"
        sideOffset={4}
        className="w-60"
      >
        <DropdownMenuLabel>
          {/* {title} {label ? `(${label})` : ''} */}
          {t(i18n)} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, i18n, icon, label, href }) => (
          <DropdownMenuItem key={`${t(i18n)}-${href}`} asChild>
            <Link
              to={href}
              onClick={closeNav}
              className={cn(
                'flex w-full items-center rounded-md px-2 py-2 transition-colors',
                checkActiveNav(href)
                  ? 'bg-muted font-semibold text-main'
                  : 'text-secText hover:bg-muted/50'
              )}
            >
              {icon}
              <span className={cn('max-w-52 text-wrap', isRtl ? 'mr-2' : 'ml-2')}>
                {t(i18n)}
              </span>
              {label && (
                <span className={cn('text-xs', isRtl ? 'mr-auto' : 'ml-auto')}>
                  {label}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
