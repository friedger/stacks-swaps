// imports
import React from 'react';

// prop types
type ModalPropsType = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  showModal: boolean;
  handleConfirm: () => void;
  handleClose: () => void;
};

// @component Modal
const Modal = ({ title, children, showModal, handleConfirm, handleClose }: ModalPropsType) => {
  // return component
  return showModal ? (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none h-screen"
        onClick={handleClose}
      >
        <div
          className="relative w-auto my-6 mx-auto top- max-w-3xl"
          onClick={(ev: React.MouseEvent<HTMLElement>) => {
            ev.stopPropagation();
          }}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            {title && (
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={handleClose}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
            )}
            {/*body*/}
            {children && (
              <div className="relative p-6 flex-auto">
                <div className="my-4 text-slate-500 text-lg leading-relaxed">{children}</div>
              </div>
            )}
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleConfirm}
              >
                Logout
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-3xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleClose}
              >
                No, I'll stay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
};

// exports
export default Modal;
