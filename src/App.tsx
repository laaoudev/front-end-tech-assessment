import { useTranslation } from 'react-i18next';
import { MixedGrid } from './components/MixedGrid/MixedGrid';
import { UserGrid } from './components/UserGrid/UserGrid';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { PostGrid } from './components/PostGrid/PostGrid';
import './App.css';

const App = () => {
	const { t } = useTranslation();

	return (
		<div className="app">
			<header className="header">
				<h1>{t('header.title')}</h1>
				<p>{t('header.subtitle')}</p>
			</header>

			<main className="main">
				<section>
					<h2>{t('userStory.title')}</h2>

					<p>{t('userStory.businessContext')}</p>
					<p>{t('userStory.overview')}</p>

					<h3>{t('userStory.whyThisMattersLabel')}</h3>
					<ul>
						{(t('userStory.whyThisMatters', { returnObjects: true }) as string[]).map(
							(item: string, i: number) => (
								<li key={i}>{item}</li>
							)
						)}
					</ul>

					<h3>{t('userStory.acceptanceCriteria')}</h3>
					<ul>
						{(t('userStory.criteria', { returnObjects: true }) as string[]).map(
							(criterion: string, i: number) => (
								<li key={i}>{criterion}</li>
							)
						)}
					</ul>

					<h3>{t('userStory.mockData')}</h3>
					<p>{t('userStory.mockDataDesc')}</p>

					<h3>{t('userStory.devToolsNote')}</h3>
					<p>{t('userStory.devToolsDesc')}</p>

					<h3>{t('userStory.noteTitle')}</h3>
					<p>{t('userStory.noteDesc1')}</p>
					<p>{t('userStory.noteDesc2')}</p>
					<p>{t('userStory.noteDesc3')}</p>
				</section>
				<section>
					<h2>{t('bonusChallenges.title')}</h2>
					<p>{t('bonusChallenges.subtitle')}</p>

					<div className="bonus-challenges">
						{[
							{
								key: 'challenge1',
								title: t('bonusChallenges.challenge1.title'),
								problem: t('bonusChallenges.challenge1.problem'),
								task: t('bonusChallenges.challenge1.task'),
								hint: t('bonusChallenges.challenge1.hint')
							},
							{
								key: 'challenge2',
								title: t('bonusChallenges.challenge2.title'),
								problem: t('bonusChallenges.challenge2.problem'),
								task: t('bonusChallenges.challenge2.task'),
								hint: t('bonusChallenges.challenge2.hint')
							}
						].map((challenge) => (
							<div key={challenge.key} className="bonus-challenge-card">
								<h3>{challenge.title}</h3>
								<p>
									<strong>Problem:</strong> {challenge.problem}
								</p>
								<p>
									<strong>Your Task:</strong> {challenge.task}
								</p>
								<p>
									<strong>💡 Hint:</strong> {challenge.hint}
								</p>
							</div>
						))}
					</div>
				</section>
				<section>
					<h2>{t('mixedGrid.title')}</h2>
					<p>{t('mixedGrid.description')}</p>
					<MixedGrid />
				</section>
				<section>
					<h2>{t('dataGlance.title')}</h2>
					<p>{t('dataGlance.description')}</p>
					<UserGrid />
					<ProductGrid />
					<PostGrid />
				</section>
				<section>
					<h2>{t('portfolio.title')}</h2>
					<p>{t('portfolio.description')}</p>

					<ol>
						{(t('portfolio.steps', { returnObjects: true }) as string[]).map(
							(step: string, i: number) => (
								<li key={i}>{step}</li>
							)
						)}
					</ol>

					<p>
						<strong>{t('portfolio.benefit')}</strong>
					</p>
					<p className="portfolio-note">
						<em>{t('portfolio.note')}</em>
					</p>
				</section>
			</main>
		</div>
	);
};

export default App;
