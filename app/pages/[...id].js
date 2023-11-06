import React from 'react';
import { getInitialProps, loadPages } from '../lib/api';
import { contentTypeMap, useCrafterAppContext } from './_app';
import Typography from '@mui/material/Typography';
import {
  ExperienceBuilder,
  RenderComponents,
  RenderField
} from '@craftercms/experience-builder/react';
import Footer from '../components/Footer';

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
  const paths = await loadPages();

  return {
    paths,
    fallback: true, 
    // fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const { model } = await getInitialProps(context);
  console.log("MODEL >>>>>>>", model);
  return {
    props: {
      params: context.params,
      model,
    },
    revalidate: 10 * 60 * 10, // In seconds
  }
}

// export async function getServerSideProps(context) {
//   const data = await getInitialProps(context);
//   return { props: data };
// }

export default function WildCardPage({ model }) {
  console.log(">>>>>>> MODEL >>>>>>>", model);
  const { isAuthoring } = useCrafterAppContext();
  if (!model) {
    return <div>No model found</div>
  }
  return (
    <>
      <pre>
        {JSON.stringify(model)}
      </pre>
      <ExperienceBuilder model={model} isAuthoring={isAuthoring}>
        <div>
          {JSON.stringify(model)}
        </div>
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

// WildCardPage.getInitialProps = getInitialProps;
