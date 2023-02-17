import classNames from 'classnames';
import { useState } from 'react';
import CreateNewProduct from './CreateNewProduct/CreateNewProduct';
import ListProduct from './ListProduct/ListProduct';

const ManageProduct = () => {
  const listTabs = [
    { title: 'List products', content: <ListProduct /> },
    { title: 'Create new product', content: <CreateNewProduct /> },
  ];

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="container">
      <div className="px-6">
        <div className="body">
          <ul className="flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0">
            {listTabs &&
              listTabs.length > 0 &&
              listTabs.map((tab, index) => (
                <li key={`tab-${tab.title}-${index}`}>
                  <button
                    className={classNames(
                      { 'text-[#2563eb]': index === currentTab },
                      { 'border-b-[#2563eb]': index === currentTab },
                      { 'text-[#4b5563]': index !== currentTab },
                      '  block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:bg-gray-100',
                    )}
                    onClick={() => setCurrentTab(index)}
                  >
                    {tab.title}
                  </button>
                </li>
              ))}
          </ul>
          <div>
            {listTabs &&
              listTabs.length > 0 &&
              listTabs.map(
                (tab, index) =>
                  index === currentTab && <div key={`tab-content_${tab.title}-${index}`}>{tab.content}</div>,
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
