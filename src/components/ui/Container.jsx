export function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`mx-auto w-full max-w-[96rem] px-5 sm:px-8 lg:px-12 3xl:max-w-[110rem] ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
