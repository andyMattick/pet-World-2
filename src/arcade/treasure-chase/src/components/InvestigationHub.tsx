import React, { useState } from 'react';
import {
  Building2,
  Anchor,
  Store,
  Landmark,
  Compass,
  Search,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { CityDestination, GameCase, InvestigationSite, SiteType } from '../types/game';
import { sounds } from '../services/soundEffects';
import worldExplorationPanoramaImg from '../assets/images/world_exploration_panorama_1792239912632.jpg';

interface InvestigationHubProps {
  currentCase: GameCase;
  onInvestigateSite: (site: InvestigationSite) => void;
  onRaidSafehouse: () => void;
  onOpenResearchForKeyword: (keyword: string) => void;
}

export const InvestigationHub: React.FC<InvestigationHubProps> = ({
  currentCase,
  onInvestigateSite,
  onRaidSafehouse,
  onOpenResearchForKeyword,
}) => {
  const currentLeg = currentCase.legs[currentCase.currentLegIndex];
  const [activeSite, setActiveSite] = useState<InvestigationSite | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const isFinalHideout = currentLeg?.isFinalHideout;

  const getSiteIcon = (type: SiteType) => {
    switch (type) {
      case 'museum':
        return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'harbor':
        return <Anchor className="w-5 h-5 text-sky-400" />;
      case 'market':
        return <Store className="w-5 h-5 text-emerald-400" />;
      case 'archive':
        return <Compass className="w-5 h-5 text-purple-400" />;
      default:
        return <Building2 className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleCopyClue = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.play('beep');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleHint = (siteId: string) => {
    sounds.play('click');
    setRevealedHints((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* City Panorama Card with Generated Exploration Image */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl">
        {/* Background Image Layer */}
        <div className="absolute inset-0">
          <img
            src={worldExplorationPanoramaImg}
            alt="World Exploration Panorama"
            className="w-full h-full object-cover object-center filter brightness-40 contrast-125 saturate-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/95" />
        </div>

        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentCase.currentCity.flag}</span>
              <span className="px-2 py-0.5 rounded text-sm font-mono tracking-wider uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold backdrop-blur-sm">
                {currentCase.currentCity.historicalEraName}
              </span>
              <span className="text-sm text-slate-300 font-mono">
                {currentCase.currentCity.continent}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-terminal drop-shadow-md">
              {currentCase.currentCity.name},{' '}
              <span className="text-slate-300 font-normal">{currentCase.currentCity.country}</span>
            </h1>
            <p className="text-base text-slate-200 mt-1 max-w-2xl leading-relaxed drop-shadow">
              {currentCase.currentCity.shortDescription}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-mono text-slate-300">
              <span className="text-amber-400 font-bold">Key Landmarks:</span>
              {currentCase.currentCity.landmarks.map((landmark, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/80 text-slate-200 text-sm backdrop-blur-sm"
                >
                  {landmark}
                </span>
              ))}
            </div>
          </div>

          {/* Climate & Radar Badge */}
          <div className="bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 flex flex-col gap-1 min-w-[210px] shadow-lg">
            <div className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>LOCAL SURVEILLANCE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm text-slate-300 italic">"{currentCase.currentCity.climateNote}"</p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-mono text-amber-300">
              <span>Investigation Cost:</span>
              <span className="font-bold">-2 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Hideout Raid Warning Banner */}
      {isFinalHideout && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-pulse">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/40 text-rose-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold uppercase tracking-widest text-rose-400">
                    CODE RED • FINAL HIDEOUT PINPOINTED
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white font-terminal">
                  The Master Thief is holed up in {currentCase.currentCity.name}!
                </h2>
                <p className="text-sm text-slate-300 max-w-xl mt-0.5">
                  Informants confirm the stolen <strong className="text-amber-300">{currentCase.artifact.name}</strong> is inside this safehouse. You must possess a legally issued Interpol Arrest Warrant to detain the suspect!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.play('alarm');
                  onRaidSafehouse();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold font-mono text-base tracking-wider shadow-lg shadow-rose-900/40 border border-rose-400 cursor-pointer transition-all transform active:scale-95 flex items-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>RAID SAFEHOUSE NOW!</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-900/50 flex items-center gap-2 text-sm font-mono">
            {currentCase.warrantIssuedFor ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4" />
                ARREST WARRANT READY: Case file authorized for apprehension.
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1.5 font-bold animate-bounce">
                <AlertTriangle className="w-4 h-4" />
                WARNING: NO WARRANT ISSUED! Suspect will escape if raided without a warrant from the Crime Computer!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Investigation Quota Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-mono">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Search className="w-4 h-4 text-amber-400" />
            City Investigation Allowance:
          </span>
          <span
            className={`px-2 py-0.5 rounded font-bold uppercase text-sm ${
              (currentLeg?.visitedSiteIds.length || 0) >= 2
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {Math.min(2, currentLeg?.visitedSiteIds.length || 0)} / 2 Witnesses Interviewed
          </span>
        </div>

        <div className="text-slate-400 text-sm text-center sm:text-right">
          {(currentLeg?.visitedSiteIds.length || 0) >= 2 ? (
            <span className="text-amber-300 font-bold">
              🔒 Quota reached! Choose your next destination or consult the Crime Computer.
            </span>
          ) : (
            <span>
              Select carefully: You can only interview <strong>2 witnesses</strong> before moving on!
            </span>
          )}
        </div>
      </div>

      {/* Three Investigation Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentLeg?.availableSites.map((site) => {
          const isVisited = currentLeg.visitedSiteIds.includes(site.id);
          const quotaReached = (currentLeg.visitedSiteIds.length >= 2) && !isVisited;
          const clueBundle = currentLeg.siteClues[site.id];

          // Compute Google search URL with highlighted keywords
          const searchKeywords = clueBundle?.destinationClue.searchKeywords || [currentCase.currentCity.name];
          const googleSearchQuery = searchKeywords.join(' ');
          const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(googleSearchQuery)}`;

          return (
            <div
              key={site.id}
              className={`flex flex-col rounded-xl border transition-all duration-200 overflow-hidden ${
                isVisited
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : quotaReached
                  ? 'bg-slate-950/60 border-slate-850 opacity-60'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Site Card Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                    {getSiteIcon(site.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 font-terminal line-clamp-1">
                      {site.name}
                    </h3>
                    <p className="text-sm text-amber-400 font-mono">{site.witnessRole}</p>
                  </div>
                </div>

                {isVisited ? (
                  <span className="px-2 py-0.5 rounded text-sm font-mono font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Interviewed
                  </span>
                ) : quotaReached ? (
                  <span className="px-2 py-0.5 rounded text-sm font-mono uppercase bg-slate-800 text-slate-500 border border-slate-700">
                    Quota Locked
                  </span>
                ) : null}
              </div>

              {/* Site Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="text-sm text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-500">Witness:</span>
                  <span className="text-slate-300 font-medium">{site.witnessName}</span>
                </div>

                {isVisited ? (
                  /* Evidence Discovered Box */
                  <div className="space-y-3">
                    {/* Destination Clue */}
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-sm font-mono uppercase tracking-wider text-amber-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Destination Clue
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {clueBundle?.destinationClue.category}
                        </span>
                      </div>

                      {/* Testimony with highlighted keywords */}
                      <p className="text-sm text-slate-200 leading-relaxed font-mono italic">
                        "{clueBundle?.destinationClue.text}"
                      </p>

                      {/* Google Search with Highlighted Keywords */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                            <span>Key Research Terms:</span>
                          </span>
                          <span className="text-sm font-mono text-amber-400">
                            Search External Archive
                          </span>
                        </div>

                        {/* Highlighted Keyword Pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {searchKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="text-sm font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                            >
                              ★ {kw}
                            </span>
                          ))}
                        </div>

                        {/* Google Search Direct Link */}
                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={googleSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => sounds.play('beep')}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
                            title={`Search Google for "${googleSearchQuery}"`}
                          >
                            <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>Search Google with Key Terms</span>
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-sm font-mono">
                        <button
                          onClick={() =>
                            handleCopyClue(
                              clueBundle?.destinationClue.text || '',
                              `${site.id}-dest`
                            )
                          }
                          className="text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `${site.id}-dest` ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy clue</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleHint(site.id)}
                          className="text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-amber-400" />
                          <span>{revealedHints[site.id] ? 'Hide Research Guide' : 'Location & Research Guide'}</span>
                        </button>
                      </div>

                      {revealedHints[site.id] && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/40 text-sm font-mono space-y-2 leading-relaxed animate-in fade-in-50 duration-150">
                          <div className="flex items-center justify-between text-amber-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-1">
                            <span className="flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-amber-400" />
                              Location Context & Research Guide
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                              {clueBundle?.destinationClue.category.toUpperCase()} DOMAIN
                            </span>
                          </div>

                          {/* Location & General Context */}
                          <div className="text-slate-300 text-sm">
                            <span className="text-slate-500 block text-sm uppercase font-bold">Location Setting:</span>
                            <span>
                              Testimony recorded in <strong>{currentCase.currentCity.name}</strong> ({currentCase.currentCity.country}, {currentCase.currentCity.continent}).
                            </span>
                          </div>

                          {/* Hints on what to look for when doing own research */}
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-amber-200/90 space-y-1">
                            <span className="text-amber-400 font-bold block text-sm uppercase">
                              🔍 What to look for during your research:
                            </span>
                            <p className="leading-snug text-sm">
                              {clueBundle?.destinationClue.category === 'battle'
                                ? 'Search for the military engagement or historical conflict cited in the testimony. Research which empire, kingdom, or sovereign capital commanded the forces, then match it to your 4 flight destination choices.'
                                : clueBundle?.destinationClue.category === 'dynasty'
                                ? 'Look up the monarch, ruler, or imperial dynasty mentioned by the witness. Determine the historic capital city where they ruled or moved their court.'
                                : clueBundle?.destinationClue.category === 'architecture'
                                ? 'Investigate the distinctive architectural style, column design, or engineering technique referenced. Identify which world city is famous for constructing this monument.'
                                : clueBundle?.destinationClue.category === 'astronomy_coordinates'
                                ? 'Cross-reference the latitude coordinate or celestial alignment cited with the geographic coordinates of the 4 destinations listed on your travel departures board.'
                                : clueBundle?.destinationClue.category === 'numismatics_culture'
                                ? 'Research the ancient coin, historical language, or literary treatise described. Discover which ancient culture or mercantile center minted or authored it.'
                                : 'Search the river, mountain pass, or body of water cited in the witness notes. Cross-reference which of the 4 departure cities is situated along that geographic feature.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suspect Trait Clue */}
                    {clueBundle?.suspectClue && (
                      <div className="bg-purple-950/30 p-3 rounded-lg border border-purple-500/30 space-y-1">
                        <div className="flex items-center justify-between text-sm font-mono uppercase tracking-wider text-purple-300">
                          <span className="font-bold">SUSPECT PROFILE NOTE</span>
                          <span className="px-1.5 py-0.2 rounded bg-purple-900/50 text-purple-200">
                            {clueBundle.suspectClue.traitName}
                          </span>
                        </div>
                        <p className="text-sm text-purple-100 font-mono italic">
                          "{clueBundle.suspectClue.text}"
                        </p>
                        <div className="text-sm font-mono text-purple-300/80 pt-1">
                          Record this in the Crime Computer to narrow down the warrant!
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Not yet visited state */
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-sm text-slate-400">
                      {quotaReached
                        ? `The ${site.witnessRole} cannot be reached. You have already conducted 2 interviews in this city.`
                        : `The ${site.witnessRole} is on duty and ready to give testimony on the fugitive's movements.`}
                    </p>
                    <span className="text-sm font-mono text-slate-500">
                      {quotaReached ? 'Quota locked' : 'Time needed: 2 hours'}
                    </span>
                  </div>
                )}

                {/* Question / Re-interview Button */}
                <button
                  disabled={quotaReached}
                  onClick={() => {
                    sounds.play('typewriter');
                    onInvestigateSite(site);
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg font-mono text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    isVisited
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer'
                      : quotaReached
                      ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {isVisited
                      ? 'Re-examine Witness Notes'
                      : quotaReached
                      ? 'City Quota Reached (2/2)'
                      : 'Interview Witness (-2 hrs)'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
