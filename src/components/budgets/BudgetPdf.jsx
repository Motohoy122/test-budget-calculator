import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import Box from '@mui/material/Box';

const BudgetPdf = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null)

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      // console.log(viewer.current)
      viewer.current,
    ).then((instance) => {
      setInstance(instance)
      // const { documentViewer, annotationManager, Annotations } = instance.Core;
      // console.log(documentViewer)
      // documentViewer.addEventListener('documentLoaded', () => {
        // const rectangleAnnot = new Annotations.RectangleAnnotation({
        //   PageNumber: 1,
        //   // values are in page coordinates with (0, 0) in the top left
        //   X: 100,
        //   Y: 150,
        //   Width: 200,
        //   Height: 50,
        //   Author: annotationManager.getCurrentUser()
        // });

        // annotationManager.addAnnotation(rectangleAnnot);
        // // need to draw the annotation otherwise it won't show up until the page is refreshed
        // annotationManager.redrawAnnotation(rectangleAnnot);
      });
    
  }, []);
    return (
        <div className="webviewer" ref={viewer} ></div>
    )
}

export default BudgetPdf
