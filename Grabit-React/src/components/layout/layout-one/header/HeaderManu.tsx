"use client";
import React, { useState, useEffect } from "react";
import home from "../../../../utility/header/home";
import classic from "../../../../utility/header/classic";
import banner from "../../../../utility/header/benner";
import column from "../../../../utility/header/columns";
import list from "../../../../utility/header/list";
import blog from "../../../../utility/header/blog";
import pages from "../../../../utility/header/pages";

import Link from "next/link";
import productpage from "../../../../utility/header/productpage";
import CurrentLocation from "./CurrentLocation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import getCategories from "@/servers/Categories";
import { Category } from "@/types";

function HeaderManu() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  console.log(categories)
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCategories({ lang: "en", page: 1, limit: 10 });
      if (result) {
        setCategories(result.categories);
      }
    };

    fetchData();
  }, []);
  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <>
      <div className="gi-header-cat d-none d-lg-block">
        <div className="container position-relative">
          <div className="gi-nav-bar">
            {/* <!-- Category Toggle --> */}
            <Tabs
  selectedIndex={selectedIndex}
  onSelect={(selectedIndex) => setSelectedIndex(selectedIndex)}
  className="gi-category-icon-block"
>
  <div className="gi-category-menu">
    <div className="gi-category-toggle">
      <i className="fi fi-rr-apps"></i>
      <span className="text">All Categories</span>
      <i
        className="fi-rr-angle-small-down d-1199 gi-angle"
        aria-hidden="true"
      ></i>
    </div>
  </div>
  <div className="gi-cat-dropdown">
    <div className="gi-cat-block">
      <div className="gi-cat-tab">
        <TabList>
          <div
            className="gi-tab-list nav flex-column nav-pills me-3"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            {categories.map((category, index) => (
              <Tab key={category._id}>
                <button
                  className={`nav-link ${selectedIndex === index ? "active" : ""}`}
                  onClick={() => handleProductClick(index)}
                  id={`v-pills-${category._id}-tab`}
                  data-bs-toggle="pill"
                  data-bs-target={`#v-pills-${category._id}`}
                  type="button"
                  role="tab"
                  aria-controls={`v-pills-${category._id}`}
                  aria-selected={selectedIndex === index}
                  style={{
                    padding: "10px 50px 10px 20px",
                    marginBottom: "10px",
                  }}
                >

                  <i className={category.icon}></i> {category.name}
                </button>
              </Tab>
            ))}
          </div>
        </TabList>

        <div className="tab-content" id="v-pills-tabContent">
          {categories.map((category, index) => (
            <TabPanel
              key={category._id}
              className={`tab-pane fade ${selectedIndex === index ? "show active product-block" : ""}`}
              role="tabpanel"
              aria-labelledby={`v-pills-${category._id}-tab`}
            >
              <div className="tab-list row">
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((subcategory) => (
                    <div className="col" key={subcategory._id}>
                      <h6 className="gi-col-title">{subcategory.name}</h6>
                      <i className={subcategory.icon}></i>
                      <ul className="cat-list">
                        <li>{subcategory.productCount} Products</li>
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="col">
                    <p>لا توجد فئات فرعية حالياً.</p>
                  </div>
                )}
              </div>
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  </div>
</Tabs>


            {/* <!-- Main Menu Start --> */}
            <div
              id="gi-main-menu-desk"
              className="d-none d-lg-block sticky-nav"
            >
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="gi-main-menu">
                      <ul>
                        <li className="dropdown drop-list">
                          <Link href="/" className="dropdown-arrow">
                            Home<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {home.map((data, index) => (
                              <li key={index}>
                                <Link href={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="dropdown drop-list position-static">
                          <Link href="" className="dropdown-arrow">
                            Categories
                            <i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="mega-menu d-block">
                            <li className="d-flex">
                              <span className="bg"></span>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link href="/">Classic</Link>
                                </li>
                                {classic.map((data, index) => (
                                  <li key={index}>
                                    <Link href={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link href="">Banner</Link>
                                </li>
                                {banner.map((data, index) => (
                                  <li key={index}>
                                    <Link href={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link href="">Columns</Link>
                                </li>
                                {column.map((data, index) => (
                                  <li key={index}>
                                    <Link href={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                              <ul className="d-block mega-block">
                                <li className="menu_title">
                                  <Link href="">List</Link>
                                </li>
                                {list.map((data, index) => (
                                  <li key={index}>
                                    <Link href={data.href}>{data.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="" className="dropdown-arrow">
                            Products<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {productpage.map((data, index) => (
                              <li
                                key={index}
                                className="dropdown position-static"
                              >
                                <Link href="">
                                  {data.name}
                                  <i className="fi-rr-angle-small-right"></i>
                                </Link>
                                <ul className="sub-menu sub-menu-child">
                                  {data.subname.map((subPage, subIndex) => (
                                    <React.Fragment key={subIndex}>
                                      <li>
                                        <Link href={subPage.href}>
                                          {subPage.name}
                                        </Link>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </ul>
                              </li>
                            ))}
                            <li>
                              <a href="/product-full-width">
                                Product full width
                              </a>
                            </li>
                            <li>
                              <a href="/product-according-full-width">
                                accordion full width
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="" className="dropdown-arrow">
                            Blog<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {blog.map((data, index) => (
                              <li key={index}>
                                <Link href={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="dropdown drop-list">
                          <Link href="" className="dropdown-arrow">
                            Pages<i className="fi-rr-angle-small-right"></i>
                          </Link>
                          <ul className="sub-menu">
                            {pages.map((data, index) => (
                              <li key={index}>
                                <Link href={data.href}>{data.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="non-drop">
                          <Link href="/banner-left-sidebar-col-3">
                            <i className="fi-rr-badge-percent"></i>Offers
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Main Menu End --> */}

            <CurrentLocation />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderManu;
