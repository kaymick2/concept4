const awsconfig = {
  aws_project_region: "us-east-2",
  aws_cognito_identity_pool_id: "us-east-2:eee482d4-0a23-4bff-bd04-3a2d7394d7e2",
  aws_cognito_region: "us-east-2",
  aws_user_pools_id: "us-east-2_JT1Zv1m5E",
  aws_user_pools_web_client_id: "9sermtoau2825qojpdf8n7m6s",
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],

  aws_user_files_s3_bucket: "userprofilepics-informatic",
  aws_user_files_s3_bucket_region: "us-east-2",

  // ✅ Add this section
  API: {
    REST: {
      endpoints: [
        {
          name: "jobAPI", // 👈 must match what you use in the code
          endpoint: "https://kz4iqk1zg5.execute-api.us-east-2.amazonaws.com/test",
          region: "us-east-2"
        }
      ]
    }
  }
};

export default awsconfig;
