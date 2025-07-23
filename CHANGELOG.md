## 1.0.0 (2025-07-23)

### Features

* add CI/CD pipeline and Git automation ([6b5348d](https://github.com/romdj/otw/commit/6b5348d9d5acc2f05ad85a2e358e9c05b1d1cf7f))
* add development tools and debugging utilities ([f27aff4](https://github.com/romdj/otw/commit/f27aff49b26dcc61da8fbce470f671e4dd1a4f46))
* add Docker containerization and orchestration ([2fff823](https://github.com/romdj/otw/commit/2fff82372b6f3ffc79fa846867fbce7d3287cebf))
* add shared domain constants and utilities ([ceaa8b6](https://github.com/romdj/otw/commit/ceaa8b687ef56113a37d8eb8f3e314fdad19530e))
* implement GraphQL server with NHL standings API ([b524344](https://github.com/romdj/otw/commit/b5243442bdb3484d3667a00fe45cc5b85dea2351))
* implement SvelteKit frontend with NHL standings visualization ([170b9ed](https://github.com/romdj/otw/commit/170b9edf71653a414f17896ac53dad19f0e036ba))
* initialize project infrastructure and workspace configuration ([f78b7c8](https://github.com/romdj/otw/commit/f78b7c80dd139ad448c196c5c871890a3b6af3f1))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-17

### Added
- Initial release of NHL 3-Point System project
- GraphQL server with Fastify + Mercurius
- SvelteKit frontend with TypeScript
- NHL API integration for standings data
- 3-point scoring system implementation (Win=3pts, OT/SO Loss=1pt, Loss=0pts)
- Multiple view types (divisions, conferences, league-wide)
- Responsive design with TailwindCSS + DaisyUI
- Real-time data fetching and visualization
- Comprehensive test suite with Jest
- Automated CI/CD pipeline with GitHub Actions
- Semantic-release configuration with 0.x.x versioning
- Claude AI context file for better development assistance

### Features
- **Backend**: GraphQL API server with TypeScript
- **Frontend**: Modern SvelteKit application with responsive design
- **Data**: Real-time NHL standings with 3-point calculation
- **UI**: Clean, modern interface with multiple viewing options
- **Testing**: Comprehensive test coverage for both backend and frontend
- **CI/CD**: Automated builds and releases

### Technical Details
- Node.js 22.x support
- TypeScript throughout the codebase
- GraphQL for efficient data fetching
- Modern build tools (Vite, TypeScript compiler)
- ESLint for code quality
- Jest for testing framework
