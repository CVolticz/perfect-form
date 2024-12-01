// system level import
import React from 'react';

// component level import
import NavBarItem from './NavBarItem';

/**
 * AnchorLink interface
 */
interface AchorLinkProps {
    children?: any;
    href: string;
    className?: string;
    icon?: any;
    tabIndex?: any;
    testId?: string;
}

const AnchorLink = ({ children, href, className, icon, tabIndex, testId }: AchorLinkProps) => {
  return (
    <a href={href}>
      <NavBarItem href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId}>
        {children}
      </NavBarItem>
    </a>
  );
};

export default AnchorLink;
