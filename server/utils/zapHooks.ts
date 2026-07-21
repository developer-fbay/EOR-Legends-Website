/**
 * New Lead Input Zap config — shared by the API relay (gf-submit.post.ts)
 * and the background watcher that rescues WP-native submissions
 * (plugins/gf24-relay.ts). Keys are the GF field labels the Zap maps on.
 */
export const GF24_ZAP = {
  hook: 'https://hooks.zapier.com/hooks/standard/2683347/79afd86203a64842b6565a0ba5fd6300/',
  title: 'Employer of Record- New Lead input',
  labels: {
    3: 'First Name',
    5: 'Last Name',
    6: 'What is the job title of the main contact?',
    7: 'What is the email address of the main contact?',
    8: 'What is the phone number of the main contact? (MUST PUT COUNTRY CODE (eg +27 for SA, +44 for UK +1 for USA). Please enter one phone number only.',
    10: 'City',
    11: 'Post Code',
    13: 'Client Sector',
    15: 'Where did you get this lead?',
    16: 'Notes',
    18: 'Lead Owner / Your Name',
    19: 'What country is the client based in?',
    21: 'What is the client company name?',
    22: 'If it was a referral, where from? Partner / Client Name',
    23: 'Any additional phone number? (MUST PUT COUNTRY CODE (eg +27 for SA, +44 for UK +1 for USA). Please enter one phone number only.',
  } as Record<string, string>,
}
