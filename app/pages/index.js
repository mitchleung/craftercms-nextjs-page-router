import React from 'react';
import { getInitialProps } from '../lib/api';
import { contentTypeMap, useCrafterAppContext } from './_app';
import Typography from '@mui/material/Typography';
import {
  ExperienceBuilder,
  RenderComponents,
  RenderField
} from '@craftercms/experience-builder/react';
import Footer from '../components/Footer';

export async function getStaticProps() {
  const { model } = await getInitialProps({params: {id: []}});
  console.log("MODEL >>>>>>>", model);
  return {
    props: {
      model,
    },
    revalidate: 10 * 60 * 10, // In seconds
  }
}

export default function Index({ model }) {
  console.log(">>>>>>> MODEL >>>>>>>", model);
  const { isAuthoring } = useCrafterAppContext();
  if (!model) {
    return <div>No model found</div>
  }
  return (
    <>
      <div>
        {JSON.stringify(model)}
      </div>
      <ExperienceBuilder model={model} isAuthoring={isAuthoring}>
        <RenderField
          model={model}
          fieldId="title_s"
          component={Typography}
          variant="title"
          componentProps={{
            // Component props can simply be sent as props to RenderField, and
            // they would be passed down to Typography, however, because there's
            // a prop name collision (i.e. `component`) we can use componentProps
            // to supply the component prop directly to Typography.
            component: 'h1'
          }}
          align="center"
          sx={{ m: 1 }}
        />
        <RenderComponents contentTypeMap={contentTypeMap} model={model} fieldId="content_o" />
        <Footer />
      </ExperienceBuilder>
    </>
  );
}

// Index.getInitialProps = getInitialProps;
