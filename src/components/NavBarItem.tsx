// system level import
import React from 'react';
import { usePathname } from 'next/navigation';

//library level import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * NavBarItem interface
 */
interface NavBarProps {
    children: any;
    href: string;
    className: string;
    icon?: any;
    tabIndex?: any;
    testId: string;
}

const NavBarItem = ({ children, href, className, icon, tabIndex, testId }: NavBarProps) => {
  const pathname = usePathname();
  const activeClass = 'navbar-item-active';
  const activeClasses = className ? `${className} ${activeClass}` : activeClass;

  return (
    <span className="d-inline-flex align-items-center navbar-item">
      {icon && <FontAwesomeIcon icon={icon} className="mr-3" />}
      <span className={pathname === href ? activeClasses : className} tabIndex={tabIndex} data-testid={testId}>
        {children}
      </span>
    </span>
  );
};

export default NavBarItem;
