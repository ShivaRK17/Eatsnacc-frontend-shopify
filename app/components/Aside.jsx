import { createContext, useContext, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({ children, heading, type }) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal },
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay z-30 ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside className='z-50 w-full md:w-1/2'>
        <div className='m-3 md:m-5 h-full relative bg-white rounded-l-4xl rounded-r-xl overflow-x-hidden'>
          <div className='overflow-y-scroll overflow-x-hidden px-4 md:px-10 p-10 h-full'>
            <header className='pb-5 text-black tracking-wide font-bold'>
              <h3 style={{ fontFamily: "Motel Xenia" }} className='text-5xl md:text-4xl'>{heading}</h3>
              <button className="close reset cursor-pointer" onClick={close} aria-label="Close">
                <IoClose size={26} />
              </button>
            </header>
            <main>{children}</main>
          </div>
        </div>
      </aside>
    </div >
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({ children }) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
