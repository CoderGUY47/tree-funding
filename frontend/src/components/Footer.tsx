'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaAngleDoubleRight, 
  FaTree,
  FaShareAlt,
  FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <section className="footer-widget-area footer-widget-area-bg">
        <div className="container">
          
          <div className="row">
            {/* Useful Links Column 1 */}
            <div className="col-lg-3 col-md-3 col-sm-12">
              <div className="footer-widget clearfix">
                <div className="sidebar-widget-wrapper">
                  <div className="footer-widget-header clearfix">
                    <h3>Organization</h3>
                  </div>
                  <ul className="footer-useful-links" style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <Link href="/explore">Explore Campaigns</Link>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <Link href="/login">Login / Sign In</Link>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <Link href="/register">Register Account</Link>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="https://github.com/coderguy/tree-funding-client" target="_blank" rel="noopener noreferrer">
                        Github Repository
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Useful Links Column 2 */}
            <div className="col-lg-3 col-md-3 col-sm-12">
              <div className="footer-widget clearfix">
                <div className="sidebar-widget-wrapper">
                  <div className="footer-widget-header clearfix">
                    <h3>Support</h3>
                  </div>
                  <ul className="footer-useful-links" style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Love Philosophy</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Share & care</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Child Education</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Medical Treatment</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Useful Links Column 3 */}
            <div className="col-lg-3 col-md-3 col-sm-12">
              <div className="footer-widget clearfix">
                <div className="sidebar-widget-wrapper">
                  <div className="footer-widget-header clearfix">
                    <h3>Discover</h3>
                  </div>
                  <ul className="footer-useful-links" style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">How To Sponsor</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Support a Volunteer</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Community Attitudes</a>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FaAngleDoubleRight style={{ marginRight: '6px', color: '#7cb032' }} />
                      <a href="#">Family Adopting</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* About Column with Tree Logo */}
            <div className="col-lg-3 col-md-3 col-sm-12">
              <div className="footer-widget clearfix">
                <div className="sidebar-widget-wrapper">
                  <div className="footer-widget-header clearfix" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <FaTree style={{ color: '#7cb032', fontSize: '24px' }} />
                    <h3 style={{ margin: 0, textTransform: 'none', display: 'inline-block' }}>
                      Tree<span style={{ color: '#7cb032' }}>Fund</span>
                    </h3>
                  </div>
                  <p>
                    TreeFund is a dedicated MERN Crowdfunding platform empowering creators and supporters to fund tree-planting campaigns and environmental solutions. Together, we build a greener future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: '30px' }}>
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="footer-widget">
                <div className="sidebar-widget-wrapper">
                  <div className="textwidget contact-us" style={{ display: 'flex', gap: '10px' }}>
                    <FaMapMarkerAlt style={{ color: '#7cb032', fontSize: '18px', marginTop: '3px' }} />
                    <p style={{ margin: 0 }}>
                      Road-2, East Shibgonj
                      <br />
                      House No: M-23, Sylhet
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="footer-widget">
                <div className="sidebar-widget-wrapper">
                  <div className="textwidget contact-us" style={{ display: 'flex', gap: '10px' }}>
                    <FaEnvelope style={{ color: '#7cb032', fontSize: '16px', marginTop: '3px' }} />
                    <p style={{ margin: 0 }}>
                      <a href="mailto:support@treefunding.com">support@treefunding.com</a>
                      <br />
                      <a href="mailto:info@treefunding.com">info@treefunding.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="footer-widget">
                <div className="sidebar-widget-wrapper">
                  <div className="textwidget contact-us" style={{ display: 'flex', gap: '10px' }}>
                    <FaPhoneAlt style={{ color: '#7cb032', fontSize: '16px', marginTop: '3px' }} />
                    <p style={{ margin: 0 }}>
                      (+880) 0823 560 433
                      <br />
                      (+880) 0823 560 434
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="footer-widget">
                <div className="sidebar-widget-wrapper">
                  <div className="textwidget contact-us" style={{ display: 'flex', gap: '10px' }}>
                    <FaShareAlt style={{ color: '#7cb032', fontSize: '16px', marginTop: '3px' }} />
                    <p style={{ margin: 0 }}>
                      Spread The Word
                      <br />
                      <a href="https://github.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="footer-social-icon" style={{ marginRight: '10px' }} aria-label="GitHub"><FaGithub /></a>
                      <a href="https://x.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="footer-social-icon" style={{ marginRight: '10px' }} aria-label="Twitter / X"><FaXTwitter /></a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" style={{ marginRight: '10px' }} aria-label="Facebook"><FaFacebookF /></a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn"><FaLinkedinIn /></a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER CONTENTS COPYRIGHT */}
      <section className="footer-contents">
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 col-sm-12 text-center">
              <p className="copyright-text">
                Copyright © {currentYear} TreeFund. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
