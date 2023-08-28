# Next.js x Drupal QuantCDN starter template

This template provides everything you need to get started with [Next.js for Drupal](https://next-drupal.org/) on QuantCDN.

A Drupal (content backend) and Next.js (frontend) will be created and deployed to Quant Cloud.

The template supports incremental static generator (ISG) and live previews out of the box. You may also switch to full-static mode to have your website compiled and pushed directly to QuantCDN whenever content changes, removing the need for a live frontend.

Click the "Deploy to Quant" button to create a new GitHub repository, QuantCDN project, and deployment pipelines.

[![Deploy to Quant](https://www.quantcdn.io/img/quant-deploy-btn-sml.svg)](https://dashboard.quantcdn.io/deploy/step-one?template=app-drupal-nextjs)


## Getting Started

## Local development

This repository contains two separate code bases; one for Drupal and one for NextJS. The local development workflow for each is slightly different. The recommended development approach is to use one of the provided local develop stacks for Drupal and use Node on your host machine to interface with the NextJS application.

### Drupal

To assist with local development this starterkit is compatible with a number of local stack management tools. We have provided some instructions to help with getting you set up quickly.

#### DDEV

To get started with [DDEV](https://ddev.readthedocs.io/en/stable/).

1. Follow the [installation documentation](https://ddev.readthedocs.io/en/stable/users/install/) for DDEV for your OS
2. Run `ddev start` from the repository root
3. Install Drupal `ddev exec ./src-drupal/vendor/bin/drush si`
4. .. (or import your database) `ddev import-db --file=dumpfile.sql.gz`

This will use the configuration file `.ddev/config.yml` and defines the minimum requirements to get your local stack up and running.

> [!NOTE]
> Because Drupal is installed in a subdirectory `ddev drush` does not work as expected; you can execute drush commands with `ddev exec ./src-drupal/vendor/bin/drush`

##### First time install in DDEV

A custom command is provided to perform a fresh site install, along with enabling the modules required for Next.js integration. To perform a fresh site install run:
```
ddev quant-install
```

If you already have a site install you may enable all required modules by simply running:
```
ddev drush pm-enable quant_nextjs
```

##### Enable Redis in DDEV

Quant Cloud codebases are Redis-enabled by default, and it is recommended you use Redis in your local development environments for the best experience.

To add Redis to your local DDEV environment simply run:

1. `ddev get ddev/ddev-redis`
2. `ddev restart`

You should see Redis is connected and functioning from the Reports > Redis report.

<!-- LANDO -->
#### Lando

To get get started with [Lando](https://docs.lando.dev/getting-started/)

1. Follow the [installation documentation](https://docs.lando.dev/getting-started/installation.html) for Lando for your OS.
2. Run `lando start` form the repository root
3. Install Drupal or import your database `lando drush si`

The configuration file is located at `.lando.yml` and defines the minimum requirements to get your local stack up and running. 

<!-- END_LANDO -->

#### Docker compose

This is a composer-managed codebase. In the `src-drupal` folder simply run `composer install` to install all required dependencies.

#### First time build (Drupal)

First, we must build Drupal and install a blank site with the recommended modules.
```
docker-compose up -d drupal
docker-compose exec drupal drush site-install
docker-compose exec drupal drush pm-enable quant_nextjs
```

Drupal will be running at http://localhost:81 and ready for content entry. Any nodes you create will be visible on your Next.js frontend.

If you prefer, you can manually set up Next.js for Drupal by following the [quick start guide](https://next-drupal.org/learn/quick-start).


Finally, bring up the Next.js frontend.
```
docker-compose up
```
From this point forward you will only need to run `docker-compose up` to bring your Drupal and Next.js containers back up.

### Next.js

Next.js is a popular React based Javascript frontend, with capabilities for static site generation and incremental static generation (ISG). This template comes preconfigured with these options active.

#### Host

To get started with NextJS development ensure that you have Node>18 installed on your machine.

1. [Install](https://nodejs.org/en/download/package-manager) Node>18 using a documented method
2. Install the client dependencies with `npm --prefix src-nexjs install`
3. Copy `.env.example` or `.env.example.ddev` to `.env.local` and update values as required
4. Run the local development server `npm --prefix src-nextjs run dev`

### Management

#### Database import & export

To export a MySQL database run `docker-compose exec -T mariadb mysqldump drupal -udrupal -pdrupal > /path/to/database.sql`.
To import a MySQL database run `docker-compose exec -T mariadb mysql drupal -udrupal -pdrupal < /path/to/database.sql`.

### Deployment & Management

This template automatically preconfigures your CI pipeline to deploy to Quant. This means you simply need to edit the codebase in the `src` folder and commit changes to trigger the build & deploy process.

#### Post-deployment script

To run processes after a deployment completes (e.g cache rebuild, configuration import) you may modify the contents of the `.docker/deployment-scripts/post-deploy.sh` script.

#### Cron Jobs

Cron jobs will run on a schedule as defined in the `.github/workflows/cron.yaml` file. By default they will run once every 3 hours.

To modify the processes that run during cron you may modify the contents of the `.docker/deployment-scripts/cron.sh` script.

#### Database backups

To take a database backup navigate to your GitHub actions page > Database backup > Run workflow. The resulting database dump will be attached as a CI artefact for download.

#### Managing settings.php and services.yml

Modify the `settings.php` and `services.yml` files provided in the `src` folder to make changes. These files are automatically added to the appropriate location in the Drupal webroot via Composer:
```
    "scripts": {
        "post-install-cmd": [
            "@php -r \"copy('settings.php', 'web/sites/default/settings.php');\"",
            "@php -r \"copy('services.yml', 'web/sites/default/services.yml');\""
        ]
    }
```

The `settings.php` file comes preloaded with important values required for operation on Quant Cloud. If you replace this file please ensure you account for the inclusions below.

**Database connection:**
```
$databases['default']['default'] = [
    'database' => getenv('MARIADB_DATABASE'),
    'username' => getenv('MARIADB_USER'),
    'password' => getenv('MARIADB_PASSWORD'),
    'host' => getenv('MARIADB_HOST'),
    'port' => getenv('MARIADB_PORT') ?: 3306,
    'driver' => 'mysql',
    'prefix' => getenv('MARIADB_PREFIX') ?: '',
    'collation' => 'utf8mb4_general_ci',
];
```

**Configuration directory:**
```
$settings['config_sync_directory'] = '../config/default';
```

**Hash salt:**
```
$settings['hash_salt'] = getenv('MARIADB_DATABASE');
```

**Trusted host patterns:**
```
$settings['trusted_host_patterns'] = [
  '\.apps\.quant\.cloud$',
];
```

**Reverse proxy:**
```
$settings['reverse_proxy'] = TRUE;
$settings['reverse_proxy_addresses'] = array($_SERVER['REMOTE_ADDR']);
```

**Origin protection (if enabled):**
```
// Direct application protection.
// Must route via edge.
$headers = getallheaders();
if (PHP_SAPI !== 'cli' &&
  ($_SERVER['REMOTE_ADDR'] != '127.0.0.1') &&
  (empty($headers['X_QUANT_TOKEN']) || $headers['X_QUANT_TOKEN'] != 'abc123')) {
  die("Not allowed.");
}
```
