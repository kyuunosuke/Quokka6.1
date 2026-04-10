/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('@supabase/supabase-js');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.quokkamole.com',
  generateRobotsTxt: true, // also creates robots.txt automatically
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: competitions, error } = await supabase
      .from('competitions')
      .select('id');

    if (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }

    return competitions.map((competition) => config.transform(config, `/competitions/${competition.id}`))
  },
}