// system level import
import React from 'react';
import Link from 'next/link';

// component level import
import NavBarItem from './NavBarItem';


/**
 * PageLink interface
 */
interface PageLinkProps {
    children?: any;
    href: string;
    className?: string;
    icon?: any;
    tabIndex?: any;
    testId?: string;
}


const PageLink = ({ children, href, className, icon, tabIndex, testId }: PageLinkProps ) => {
  return (
    <Link legacyBehavior href={href}>
      <a>
        <NavBarItem href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId}>
          {children}
        </NavBarItem>
      </a>
    </Link>
  );
};

export default PageLink;
