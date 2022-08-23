import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import BudgetList from './components/budgets/BudgetList'
import './App.css'
import BudgetPdf from './components/budgets/BudgetPdf';

const App = () => {
  

  return (
    <div>
      <BudgetList key='BudgetList1' />
      {/* <BudgetPdf /> */}
    </div>
    
  )
}

export default App;
