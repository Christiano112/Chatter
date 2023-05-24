import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default Layout;