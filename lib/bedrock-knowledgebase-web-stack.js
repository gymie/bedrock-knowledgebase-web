const { Stack, Duration, CfnOutput, RemovalPolicy } = require('aws-cdk-lib');
const s3  = require('aws-cdk-lib/aws-s3');
const { bedrock } = require('@cdklabs/generative-ai-cdk-constructs');

class BedrockKnowledgebaseWebStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const dataSourceBucket = new s3.Bucket(this, 'DataSourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const knowledgeBase = new bedrock.KnowledgeBase(this, 'KnowledgeBase', {
      embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V2_1024,
      instruction: 'use this knowledge base to answer questions about generative ai tour event',
    });

    new bedrock.S3DataSource(this, 'DataSource', {
      bucket: dataSourceBucket,
      knowledgeBase: knowledgeBase,
      dataSourceName: 'genaitour-events',
      chunkingStrategy: bedrock.ChunkingStrategy.DEFAULT,
    });

    new CfnOutput(this, 'KnowledgeBaseId', {
      value: knowledgeBase.knowledgeBaseId,
    });
  }
}

module.exports = { BedrockKnowledgebaseWebStack }
